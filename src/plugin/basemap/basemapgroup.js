goog.module('plugin.basemap.Group');
goog.module.declareLegacyNamespace();

goog.require('os.data.ZOrderEventType');

const osLayerGroup = goog.require('os.layer.Group');



/**
 */
class Group extends osLayerGroup {
  /**
   * Constructor.
   * @param {olx.layer.GroupOptions=} opt_options
   */
  constructor(opt_options) {
    super(opt_options);

    this.setPriority(-1000);
    this.setCheckFunc(plugin.basemap.isBaseMap);
    this.setOSType(plugin.basemap.LAYER_TYPE);
  }
}

exports = Group;
