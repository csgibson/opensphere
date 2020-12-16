goog.module('os.job.JobState');
goog.module.declareLegacyNamespace();

/**
 * Worker execution states.
 * @enum {number}
 */
exports = {
  'IDLE': 0,
  'EXECUTING': 1,
  'COMPLETE': 2,
  'PAUSED': 3,
  'STOPPED': 4,
  'ERROR': 5,
  'LOG': 6
};
