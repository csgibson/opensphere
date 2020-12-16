goog.module('plugin.position.PositionInteraction');
goog.module.declareLegacyNamespace();

const condition = goog.require('ol.events.condition');
const Interaction = goog.require('ol.interaction.Interaction');
const I3DSupport = goog.require('os.I3DSupport');
const osImplements = goog.require('os.implements');
const Metrics = goog.require('os.metrics.Metrics');
const keys = goog.require('os.metrics.keys');


/**
 * Handles the behavior of clicking the PERIOD button or Copy Coordinates from the context menu.
 *
 * @implements {I3DSupport}
 */
class PositionInteraction extends Interaction {
  /**
   * Constructor.
   */
  constructor() {
    super({
      handleEvent: PositionInteraction.handleEvent
    });

    this.condition_ = goog.functions.and(condition.noModifierKeys, condition.targetNotEditable);
  }

  /**
   * Whether or not this interaction is supported in 3D mode
   *
   * @return {boolean}
   * @override
   */
  is3DSupported() {
    return true;
  }

  /**
   * @param {ol.MapBrowserEvent} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @this plugin.position.PositionInteraction
   * @suppress {duplicate}
   */
  static handleEvent(mapBrowserEvent) {
    var stopEvent = false;
    if (mapBrowserEvent.type == ol.events.EventType.KEYDOWN && this.condition_(mapBrowserEvent)) {
      var keyCode = mapBrowserEvent.originalEvent.keyCode;
      stopEvent = true;

      switch (keyCode) {
        case goog.events.KeyCodes.PERIOD:
          Metrics.getInstance().updateMetric(keys.Map.COPY_COORDINATES_KB, 1);
          plugin.position.launchCopy();
          break;
        default:
          stopEvent = false;
          break;
      }
    }

    if (stopEvent) {
      mapBrowserEvent.preventDefault();
    }

    return !stopEvent;
  }
}

osImplements(PositionInteraction, I3DSupport.ID);


exports = PositionInteraction;
