goog.module('plugin.basemap.TerrainNodeUIUI');
goog.module.declareLegacyNamespace();

const settings = goog.require('os.config.Settings');
const Module = goog.require('os.ui.Module');
const DefaultLayerNodeUICtrl = goog.require('os.ui.node.DefaultLayerNodeUICtrl');


/**
 * @type {string}
 */
plugin.basemap.TerrainNodeUITemplate =
  '<span ng-if="nodeUi.show()" class="d-flex flex-shrink-0">' +
    '<span ng-if="nodeUi.isRemovable()" ng-click="nodeUi.remove()">' +
      '<i class="fa fa-times fa-fw c-glyph" title="Remove the terrain layer"></i></span>' +
    '</span>' +
  '</span>';


/**
 * The terrain layer node UI.
 *
 * @return {angular.Directive}
 */
const directive = () => ({
  restrict: 'AE',
  replace: true,
  template: plugin.basemap.TerrainNodeUITemplate,
  controller: Controller,
  controllerAs: 'nodeUi'
});


/**
 * Add the directive to the module.
 */
Module.directive('terrainnodeui', [directive]);



/**
 * Controller for the terrain layer node UI.
 * @unrestricted
 */
class Controller extends DefaultLayerNodeUICtrl {
  /**
   * Constructor.
   * @param {!angular.Scope} $scope
   * @param {!angular.JQLite} $element
   * @ngInject
   */
  constructor($scope, $element) {
    super($scope, $element);
  }

  /**
   * Remove the terrain layer.
   *
   * @override
   * @export
   */
  remove() {
    // remove the layer via setting change
    settings.getInstance().set(os.config.DisplaySetting.ENABLE_TERRAIN, false);
  }
}

exports = {
  Controller,
  directive
};
