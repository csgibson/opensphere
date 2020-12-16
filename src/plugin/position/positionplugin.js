goog.module('plugin.position.PositionPlugin');
goog.module.declareLegacyNamespace();

const MapContainer = goog.require('os.MapContainer');
const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const map = goog.require('os.ui.menu.map');
const PositionInteraction = goog.require('plugin.position.PositionInteraction');
goog.require('os.map');
goog.require('os.ui.action.Action');
goog.require('os.ui.action.MenuOptions');


goog.require('plugin.position.copyPositionDirective');

/**
 * Provides map layer support
 */
class PositionPlugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.id = PositionPlugin.ID;
  }

  /**
   * @inheritDoc
   */
  init() {
    if (map.MENU) {
      var menu = map.MENU;

      var group = menu.getRoot().find(map.GroupLabel.COORDINATE);
      if (group) {
        group.addChild({
          label: 'Copy Coordinates',
          eventType: os.action.EventType.COPY,
          tooltip: 'Copy coordinates to clipboard',
          icons: ['<i class="fa fa-fw fa-sticky-note"></i>'],
          shortcut: '.',
          metricKey: os.metrics.keys.Map.COPY_COORDINATES_CONTEXT_MENU
        });
      }

      menu.listen(os.action.EventType.COPY, plugin.position.onCopy_);
    }

    MapContainer.getInstance().getMap().getInteractions().push(new PositionInteraction());
  }
}

goog.addSingletonGetter(PositionPlugin);


/**
 * @type {string}
 * @const
 */
PositionPlugin.ID = 'position';


/**
 * @param {os.ui.menu.MenuEvent} evt The menu event
 */
plugin.position.onCopy_ = function(evt) {
  plugin.position.launchCopy(/** @type {ol.Coordinate} */ (evt.getContext()));
};


/**
 * @param {ol.Coordinate=} opt_coord The coordinate
 */
plugin.position.launchCopy = function(opt_coord) {
  os.metrics.Metrics.getInstance().updateMetric(os.metrics.keys.Map.COPY_COORDINATES, 1);
  var controls = MapContainer.getInstance().getMap().getControls().getArray();
  var mousePos = null;
  for (var i = 0, n = controls.length; i < n; i++) {
    if (controls[i] instanceof os.ol.control.MousePosition) {
      mousePos = /** @type {os.ol.control.MousePosition} */ (controls[i]);
      break;
    }
  }

  if (mousePos) {
    var positionString = mousePos.getPositionString(opt_coord);
    if (positionString) {
      plugin.position.CopyPositionCtrl.launch(positionString);
    }
  }
};
exports = PositionPlugin;
