// src/services/anomalyService.js
//
// Flags statistically unusual near-earth objects within a fetched batch.
//
// NASA's `is_potentially_hazardous_asteroid` flag is a fixed rule (diameter
// + miss-distance thresholds defined by NASA/JPL) — it does not tell you
// which objects are unusual *relative to the current batch*. This service
// adds a second, complementary signal: for each numeric feature (diameter,
// approach velocity, miss distance), compute the z-score against the batch's
// mean/stddev, and flag objects that are outliers on one or more axes. This
// surfaces objects like "unusually fast for this week" or "unusually close"
// even when they fall under NASA's hazardous-object size cutoff.
//
// Method: population z-score, |z| > threshold (default 2.0, i.e. ~95th
// percentile under a normal approximation). Small-sample batches (<5
// objects) are skipped — z-scores are unreliable at that sample size and
// the endpoint says so explicitly rather than fabricating a signal.

const MIN_SAMPLE_SIZE = 5;
const DEFAULT_Z_THRESHOLD = 2.0;

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values, avg) {
  const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function zScore(value, avg, sd) {
  if (sd === 0) return 0; // no variance in this batch — nothing is an outlier
  return (value - avg) / sd;
}

/**
 * @param {Array} objects - output of nasaService.getAsteroids().objects
 * @param {number} zThreshold - |z| above which an object is flagged
 */
function detectAnomalies(objects, zThreshold = DEFAULT_Z_THRESHOLD) {
  const usable = objects.filter(
    (o) => o.diameter?.kilometers?.estimated_diameter_max != null &&
      o.closestApproach?.missDistanceKm != null &&
      o.closestApproach?.velocityKmS != null
  );

  if (usable.length < MIN_SAMPLE_SIZE) {
    return {
      analyzed: usable.length,
      skipped: true,
      reason: `Batch too small for reliable statistics (need >= ${MIN_SAMPLE_SIZE}, got ${usable.length}).`,
      anomalies: [],
    };
  }

  const features = usable.map((o) => ({
    id: o.id,
    name: o.name,
    isHazardous: o.isHazardous,
    diameterKm: parseFloat(o.diameter.kilometers.estimated_diameter_max),
    velocityKmS: parseFloat(o.closestApproach.velocityKmS),
    missDistanceKm: parseFloat(o.closestApproach.missDistanceKm),
    approachDate: o.closestApproach.date,
  }));

  const diameterVals = features.map((f) => f.diameterKm);
  const velocityVals = features.map((f) => f.velocityKmS);
  // Invert miss distance so "closer than average" produces a positive z-score
  // in the same direction as "more dangerous", matching diameter/velocity.
  const missDistanceVals = features.map((f) => -f.missDistanceKm);

  const diameterMean = mean(diameterVals);
  const diameterSd = stddev(diameterVals, diameterMean);
  const velocityMean = mean(velocityVals);
  const velocitySd = stddev(velocityVals, velocityMean);
  const missMean = mean(missDistanceVals);
  const missSd = stddev(missDistanceVals, missMean);

  const scored = features.map((f) => {
    const zDiameter = zScore(f.diameterKm, diameterMean, diameterSd);
    const zVelocity = zScore(f.velocityKmS, velocityMean, velocitySd);
    const zMissDistance = zScore(-f.missDistanceKm, missMean, missSd);

    const flags = [];
    if (zDiameter >= zThreshold) flags.push({ metric: 'diameter', z: round(zDiameter), note: 'unusually large vs. this batch' });
    if (zVelocity >= zThreshold) flags.push({ metric: 'velocity', z: round(zVelocity), note: 'unusually fast vs. this batch' });
    if (zMissDistance >= zThreshold) flags.push({ metric: 'missDistance', z: round(zMissDistance), note: 'unusually close approach vs. this batch' });

    return {
      ...f,
      diameterKm: round(f.diameterKm),
      velocityKmS: round(f.velocityKmS),
      missDistanceKm: round(f.missDistanceKm),
      zScores: { diameter: round(zDiameter), velocity: round(zVelocity), missDistance: round(zMissDistance) },
      isAnomalous: flags.length > 0,
      anomalyFlags: flags,
    };
  });

  const anomalies = scored.filter((s) => s.isAnomalous).sort((a, b) => {
    const maxZ = (s) => Math.max(...s.anomalyFlags.map((f) => f.z));
    return maxZ(b) - maxZ(a);
  });

  return {
    analyzed: usable.length,
    skipped: false,
    zThreshold,
    batchStats: {
      diameterKm: { mean: round(diameterMean), stddev: round(diameterSd) },
      velocityKmS: { mean: round(velocityMean), stddev: round(velocitySd) },
      missDistanceKm: { mean: round(-missMean), stddev: round(missSd) },
    },
    anomalyCount: anomalies.length,
    anomalies,
    method: 'Population z-score per feature (diameter, velocity, inverted miss-distance); flags |z| >= threshold. Independent of NASA\'s fixed hazardous-object rule.',
  };
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

module.exports = { detectAnomalies };
