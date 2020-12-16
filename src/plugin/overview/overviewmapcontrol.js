goog.module('plugin.overview.OverviewMap');
goog.module.declareLegacyNamespace();

const settings = goog.require('os.config.Settings');
const MapContainer = goog.require('os.MapContainer');
const MapProperty = goog.require('ol.MapProperty');
const View = goog.require('ol.View');
const olControlOverviewMap = goog.require('ol.control.OverviewMap');
const map = goog.require('os.map');


/**
 * @suppress {accessControls} To allow access to the box overlay.
 */
class OverviewMap extends olControlOverviewMap {
  /**
   * Constructor.
   * @param {olx.control.OverviewMapOptions=} opt_opts
   */
  constructor(opt_opts) {
    super(opt_opts);
    this.updateView_();

    /* Interactive map in 3D mode */

    var ovmap = this.ovmap_;
    var endMoving = function(event) {
      var mapContainer = MapContainer.getInstance();
      if (mapContainer.is3DEnabled()) {
        var coordinates = ovmap.getEventCoordinate(event);

        mapContainer.flyTo(/** @type {!osx.map.FlyToOptions} */ ({
          center: coordinates
        }));
      }

      window.removeEventListener('mouseup', endMoving);
    };

    this.boxOverlay_.getElement().addEventListener('mousedown', function() {
      window.addEventListener('mouseup', endMoving);
    });
  }

  /**
   * @return {ol.Collection<ol.layer.Base>}
   * @suppress {accessControls}
   */
  getLayers() {
    return this.ovmap_.getLayers();
  }

  /**
   * @inheritDoc
   * @suppress {accessControls}
   */
  handleMapPropertyChange_(evt) {
    if (evt.key === MapProperty.VIEW) {
      this.updateView_();
    }

    super.handleMapPropertyChange_(evt);
  }

  /**
   * Updates the view with the current projection
   *
   * @private
   * @suppress {accessControls}
   */
  updateView_() {
    var view = new View({
      projection: map.PROJECTION,
      minZoom: map.MIN_ZOOM,
      maxZoom: map.MAX_ZOOM
    });

    if (this.getMap()) {
      var mainView = this.getMap().getView();

      if (mainView) {
        view.setCenter(mainView.getCenter());
        view.setResolution(mainView.getResolution());
      }
    }

    this.ovmap_.setView(view);
  }

  /**
   * @inheritDoc
   * @suppress {accessControls}
   */
  handleClick_(event) {
    super.handleClick_(event);
    settings.getInstance().set(OverviewMap.SHOW_KEY, this.getCollapsed());
  }
}


/**
 * @type {!Array<string>}
 * @const
 */
OverviewMap.SHOW_KEY = ['overview', 'show'];


exports = OverviewMap;
