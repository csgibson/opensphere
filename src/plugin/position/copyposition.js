goog.module('plugin.position.CopyPositionUI');
goog.module.declareLegacyNamespace();

goog.require('os.action.EventType');
goog.require('os.defines');

const ui = goog.require('os.ui');
const Disposable = goog.require('goog.Disposable');
const events = goog.require('goog.events');
const Module = goog.require('os.ui.Module');



/**
 * A directive to launch the copy coordinates GUI
 *
 * @return {angular.Directive}
 */
const directive = () => ({
  restrict: 'AE',
  replace: true,

  scope: {
    'value': '='
  },

  templateUrl: os.ROOT + 'views/plugin/position/positionplugin.html',
  controller: Controller,
  controllerAs: 'copyPosition'
});


/**
 * Add the directive to the module
 */
Module.directive('copyPosition', [directive]);



/**
 * Create a popup with the current map (mouse) location information to be copied
 * @unrestricted
 */
class Controller extends Disposable {
  /**
   * Constructor.
   * @param {!angular.Scope} $scope
   * @param {!angular.JQLite} $element
   * @ngInject
   */
  constructor($scope, $element) {
    super();

    /**
     * @type {?angular.JQLite}
     * @private
     */
    this.element_ = $element;

    /**
     * @type {!events.KeyHandler}
     * @private
     */
    this.keyHandler_ = new events.KeyHandler(goog.dom.getDocument());
    this.keyHandler_.listen(events.KeyHandler.EventType.KEY, this.handleKeyEvent_, false, this);

    $scope.$emit(ui.WindowEventType.READY);

    $scope.$on('$destroy', this.onDestroy_.bind(this));
  }

  /**
   * Clean up
   *
   * @private
   */
  onDestroy_() {
    goog.dispose(this.keyHandler_);

    this.element_ = null;
  }

  /**
   * Close the window
   */
  close() {
    ui.window.close(this.element_);
  }

  /**
   * Close the window if the user hits ENTER
   *
   * @param {events.KeyEvent} event
   * @private
   */
  handleKeyEvent_(event) {
    if (event.keyCode == events.KeyCodes.ENTER) {
      this.close();
    }
  }

  /**
   * Launch the copy coordinates window
   *
   * @param {string} value
   */
  static launch(value) {
    var id = 'copyPosition';

    if (ui.window.exists(id)) {
      ui.window.bringToFront(id);
    } else {
      var windowOptions = {
        'id': id,
        'label': 'Copy Coordinates',
        'icon': 'fa fa-sticky-note',
        'x': 'center',
        'y': 'center',
        'width': '300',
        'height': 'auto',
        'modal': 'true'
      };
      var scopeOptions = {
        'value': value
      };

      var template = '<copy-position value="value"></copy-position>';
      ui.window.create(windowOptions, template, undefined, undefined, undefined, scopeOptions);
    }
  }
}

exports = {
  Controller,
  directive
};
