goog.module('plugin.params.menu');
goog.module.declareLegacyNamespace();

goog.require('os.implements');
goog.require('os.ol.source.IUrlSource');
goog.require('plugin.params.editRequestParamsDirective');

const alertManager = goog.require('os.alert.AlertManager');
const osUiMenuLayer = goog.require('os.ui.menu.layer');
const pluginParams = goog.require('plugin.params');



/**
 * Set up params menu items in the layer menu.
 */
const layerSetup = function() {
  var menu = osUiMenuLayer.MENU;
  if (menu && !menu.getRoot().find(pluginParams.EventType.EDIT_PARAMS)) {
    var group = menu.getRoot().find(osUiMenuLayer.GroupLabel.LAYER);
    goog.asserts.assert(group, 'Group should exist! Check spelling?');

    group.addChild({
      label: 'Edit Parameters...',
      eventType: pluginParams.EventType.EDIT_PARAMS,
      tooltip: 'Edit request parameters for the layer',
      icons: ['<i class="fa fa-fw fa-gears"></i>'],
      beforeRender: visibleIfSupported_,
      handler: handleLayerAction_,
      metricKey: pluginParams.Metrics.EDIT_PARAMS
    });
  }
};

/**
 * Clean up params menu items in the layer menu.
 */
const layerDispose = function() {
  var menu = osUiMenuLayer.MENU;
  if (menu && !menu.getRoot().find(pluginParams.EventType.EDIT_PARAMS)) {
    var group = menu.getRoot().find(osUiMenuLayer.GroupLabel.LAYER);
    if (group) {
      group.removeChild(pluginParams.EventType.EDIT_PARAMS);
    }
  }
};

/**
 * Test if an event context supports editing layer request parameters.
 *
 * @param {osUiMenuLayer.Context} context The menu context.
 * @this {os.ui.menu.MenuItem}
 */
const visibleIfSupported_ = function(context) {
  this.visible = false;

  // only allow editing parameters for one layer at a time
  if (context && context.length === 1) {
    var layers = osUiMenuLayer.getLayersFromContext(context);
    if (layers && layers.length === 1 && layers[0] instanceof ol.layer.Layer) {
      this.visible = pluginParams.supportsParamOverrides(/** @type {!ol.layer.Layer} */ (layers[0]));
    }
  }
};

/**
 * Handle params event from the layer menu.
 *
 * @param {!os.ui.menu.MenuEvent<osUiMenuLayer.Context>} event The menu event.
 */
const handleLayerAction_ = function(event) {
  var layers = osUiMenuLayer.getLayersFromContext(event.getContext());
  if (layers && layers.length === 1 && layers[0] instanceof ol.layer.Layer) {
    var layer = /** @type {!ol.layer.Layer} */ (layers[0]);
    var params = pluginParams.getParamsFromLayer(layer);
    pluginParams.launchParamsEdit(layer, params);
  } else {
    alertManager.getInstance().sendAlert('Unexpected layer selection. Please select a single layer and try again.',
        os.alert.AlertEventSeverity.WARNING);
  }
};

exports = {
  layerSetup,
  layerDispose,
  visibleIfSupported_
};
