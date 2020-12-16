goog.module('os.record.Record');
goog.module.declareLegacyNamespace();

const IRecord = goog.requireType('os.record.IRecord');


/**
 * The most basic implementation of a record.
 *
 * @implements {IRecord}
 */
class Record {
  /**
   * Constructor.
   */
  constructor() {
    this.id = '' + Record.RECORD_ID_;
    Record.RECORD_ID_++;
  }
}


/**
 * A one-up counter for all records
 * @type {number}
 * @private
 */
Record.RECORD_ID_ = 0;


/**
 * @inheritDoc
 */
Record.prototype.id = null;


/**
 * @inheritDoc
 */
Record.prototype.color = 0;


/**
 * @inheritDoc
 */
Record.prototype.recordTime = null;
exports = Record;
