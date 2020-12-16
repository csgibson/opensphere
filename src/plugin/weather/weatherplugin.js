goog.module('plugin.weather.WeatherPlugin');
goog.module.declareLegacyNamespace();

const settings = goog.require('os.config.Settings');
const osMap = goog.require('os.map');
const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const map = goog.require('os.ui.menu.map');


/**
 * Provides a Weather menu option when right-clicking the map. The resulting location is then
 * opened in a new tab with the configured weather URL.
 */
class WeatherPlugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.id = WeatherPlugin.ID;
  }

  /**
   * @inheritDoc
   */
  init() {
    var url = plugin.weather.getUrl_();
    var menu = map.MENU;

    if (url && menu) {
      var group = menu.getRoot().find(map.GroupLabel.COORDINATE);

      if (group) {
        group.addChild({
          label: 'Weather Forecast',
          eventType: WeatherPlugin.ID,
          tooltip: 'Open the weather forecast for this location',
          icons: ['<i class="fa fa-fw fa-umbrella"></i>']
        });

        menu.listen(WeatherPlugin.ID, plugin.weather.onLookup_);
      }
    }
  }
}


/**
 * @type {string}
 * @const
 */
WeatherPlugin.ID = 'weather';


/**
 * @return {?string} the weather URL
 * @private
 */
plugin.weather.getUrl_ = function() {
  var url = /** @type {string} */ (settings.getInstance().get(['weather', 'url']));

  if (url && url.indexOf('{lat}') > -1 && url.indexOf('{lon}') > -1) {
    return url;
  }

  return null;
};


/**
 * Forecast menu option listener
 *
 * @param {os.ui.menu.MenuEvent<ol.Coordinate>} evt The menu event
 * @private
 */
plugin.weather.onLookup_ = function(evt) {
  plugin.weather.launchForecast(evt.getContext());
};


/**
 * Opens a weather forecast for the given location
 *
 * @param {ol.Coordinate} coord
 */
plugin.weather.launchForecast = function(coord) {
  var url = plugin.weather.getUrl_();
  coord = ol.proj.toLonLat(coord, osMap.PROJECTION);

  if (url) {
    url = url.replace('{lon}', coord[0].toString());
    url = url.replace('{lat}', coord[1].toString());

    window.open(url, '_blank');
  }
};
exports = WeatherPlugin;
