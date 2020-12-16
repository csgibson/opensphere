goog.module('os.load.LoadingEvent');
goog.module.declareLegacyNamespace();

const Event = goog.require('goog.events.Event');


/**
 * @enum {string}
 */
os.load.LoadingEventType = {
  ADD: 'load:add',
  REMOVE: 'load:remove'
};



/**
 * Event representing a loading task change.
 */
class LoadingEvent extends Event {
  /**
   * Constructor.
   * @param {string} type
   * @param {os.load.ILoadingTask=} opt_task
   */
  constructor(type, opt_task) {
    super(type);

    /**
     * @type {?os.load.ILoadingTask}
     */
    this.task = opt_task || null;
  }

  /**
   * Get the task
   *
   * @return {os.load.ILoadingTask}
   */
  getTask() {
    return this.task;
  }

  /**
   * Set the task
   *
   * @param {os.load.ILoadingTask} value
   */
  setTask(value) {
    this.task = value;
  }
}

exports = LoadingEvent;
