goog.module('os.record.IRecord');
goog.module.declareLegacyNamespace();

const ITime = goog.requireType('os.time.ITime');


/**
 * A simple interface for describing a record
 *
 * @interface
 */
class IRecord {
  /**
   * The ID of the record
   * @type {string}
   */
  id() {}

  /**
   * The color of the record
   * @type {number}
   */
  color() {}

  /**
   * The time for the record
   * @type {ITime}
   */
  recordTime() {}
}

exports = IRecord;
