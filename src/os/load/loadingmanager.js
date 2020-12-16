goog.module('os.load.LoadingManager');
goog.module.declareLegacyNamespace();

goog.require('goog.events.Event');

const EventTarget = goog.require('goog.events.EventTarget');
const log = goog.require('goog.log');
const PropertyChangeEvent = goog.require('os.events.PropertyChangeEvent');
const LoadingEvent = goog.require('os.load.LoadingEvent');
const LoadingTask = goog.require('os.load.LoadingTask');



/**
 * Manages loading tasks within an application.
 */
class LoadingManager extends EventTarget {
  /**
   * Constructor.
   */
  constructor() {
    super();

    /**
     * @type {log.Logger}
     * @protected
     */
    this.log = LoadingManager.LOGGER_;

    /**
     * @type {Object<string, os.load.ILoadingTask>}
     * @private
     */
    this.loadingTasks_ = {};
  }

  /**
   * Gets the overall loading state.
   *
   * @return {boolean}
   */
  getLoading() {
    return !goog.object.isEmpty(this.loadingTasks_);
  }

  /**
   * Gets the count of loading things.
   *
   * @return {number}
   */
  getLoadingCount() {
    var count = 0;
    for (var key in this.loadingTasks_) {
      var task = this.loadingTasks_[key];
      count += task.getCount();
    }

    return count;
  }

  /**
   * Adds a loading task by ID. The task is referenced by ID so that can later be removed either by the client who added
   * it (or the client who added it can listen for what it gets removed). Also fires an event if the overall loading
   * state becomes true.
   *
   * @param {string} id ID for the loading task.
   * @param {string=} opt_title Optional title for the loading task.
   * @param {boolean=} opt_cpuIntensive Whether the task is CPU intensive
   */
  addLoadingTask(id, opt_title, opt_cpuIntensive) {
    var oldLoading = this.getLoading();

    if (this.loadingTasks_[id]) {
      // it already exists, so increment its count
      log.fine(this.log, 'Incrementing load count for task ID: ' + id);
      this.loadingTasks_[id].incrementCount();
    } else {
      // it's new, so create it and dispatch the event indicating a new loading task
      log.fine(this.log, 'Adding new loading task with ID: ' + id);
      var task = new LoadingTask(id, opt_title, opt_cpuIntensive);
      task.incrementCount();
      this.loadingTasks_[id] = task;
      this.dispatchEvent(new LoadingEvent(os.load.LoadingEventType.ADD, task));
    }

    if (!oldLoading && oldLoading !== this.getLoading()) {
      // loading state has changed, dispatch an event
      var loadingChangeEvent = new PropertyChangeEvent(LoadingManager.LOADING, true, false);
      this.dispatchEvent(loadingChangeEvent);
    }
  }

  /**
   * Removes a loading task by ID. An event is fired so that any interested client can respond to the loading task
   * being removed. Also fires an event if the overall loading state goes to false.
   *
   * @param {string} id
   * @return {?os.load.ILoadingTask}
   */
  removeLoadingTask(id) {
    var task = this.loadingTasks_[id];

    if (task) {
      log.fine(this.log, 'Decrementing load count for task ID: ' + id);
      task.decrementCount();

      if (task.getCount() <= 0) {
        log.fine(this.log, 'Removing load task with ID: ' + id);
        delete this.loadingTasks_[id];
        this.dispatchEvent(new LoadingEvent(os.load.LoadingEventType.REMOVE, task));
      }

      if (!this.getLoading()) {
        var loadingChangeEvent = new PropertyChangeEvent(LoadingManager.LOADING, false, true);
        this.dispatchEvent(loadingChangeEvent);
      }
    }

    return task;
  }
}

goog.addSingletonGetter(LoadingManager);


/**
 * @type {log.Logger}
 * @const
 * @private
 */
LoadingManager.LOGGER_ = log.getLogger('os.load.LoadingManager');


/**
 * @type {string}
 * @const
 */
LoadingManager.LOADING = 'loadingManager:loading';


exports = LoadingManager;
