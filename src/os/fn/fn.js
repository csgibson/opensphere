/**
 * @fileoverview Helpers for functional programming with the opensphere/openlayers API
 */
goog.module('os.fn');

goog.module.declareLegacyNamespace();

const olExtent = goog.require('ol.extent');
const GeometryType = goog.require('ol.geom.GeometryType');
const Layer = goog.require('ol.layer.Layer');
const osExtent = goog.require('os.extent');


/**
 * @param {*} item The item
 * @return {boolean} Whether or not the item is truthy
 */
const filterFalsey = function(item) {
  return !!item;
};

/**
 * Reduce layers to a combined extent.
 *
 * @example
 * var extent = layers.reduce(os.fn.reduceExtentFromLayers, olExtent.createEmpty());
 *
 * @param {!ol.Extent} extent The extent
 * @param {!(os.layer.ILayer|Layer)} layer The layer
 * @return {!ol.Extent} The combined extent
 */
const reduceExtentFromLayers = function(extent, layer) {
  if (layer instanceof Layer) {
    var olayer = /** @type {Layer} */ (layer);
    var ex = olayer.getExtent();

    if (!ex) {
      var source = olayer.getSource();

      if (source instanceof ol.source.Vector ||
          source instanceof ol.source.UrlTile) {
        ex = (/** @type {ol.source.Vector|ol.source.UrlTile} */ (source)).getExtent();
      }
    }

    if (ex) {
      olExtent.extend(extent, ex);
    }
  }

  return extent;
};

/**
 * @param {!ol.Extent} extent The extent
 * @param {?(ol.geom.Geometry|{geometry: ol.geom.Geometry})|undefined} geometry The geometry
 * @return {!ol.Extent} The combined extent
 */
const reduceExtentFromGeometries = function(extent, geometry) {
  if (geometry) {
    var geom = /** @type {ol.geom.Geometry} */ (
      /** @type {ol.geom.Geometry} */ (geometry).getType ? geometry : geometry.geometry);

    if (geom) {
      olExtent.extend(extent, osExtent.getFunctionalExtent(geom));
    }
  }

  return extent;
};

/**
 * @param {!Array<number>} extent
 * @param {?ol.geom.Geometry|undefined} geometry
 * @return {!Array<number>}
 */
const reduceAltitudeExtentFromGeometries = function(extent, geometry) {
  if (geometry) {
    var type = geometry.getType();

    if (type === GeometryType.GEOMETRY_COLLECTION) {
      var geoms = /** @type {ol.geom.GeometryCollection} */ (geometry).getGeometriesArray();
      extent = geoms.reduce(reduceAltitudeExtentFromGeometries, extent);
    } else {
      geometry = /** @type {ol.geom.SimpleGeometry} */ (geometry);
      var flats = geometry.getFlatCoordinates();
      var stride = geometry.getStride();

      for (var i = 0, n = flats.length; i < n; i += stride) {
        var alt = flats[i + 2] || 0;
        extent[0] = Math.min(extent[0], alt);
        extent[1] = Math.max(extent[1], alt);
      }
    }
  }

  return extent;
};

/**
 * @param {undefined|null|Layer} layer The layer
 * @return {undefined|ol.source.Source} The source, if any
 */
const mapLayerToSource = function(layer) {
  return layer ? layer.getSource() : undefined;
};

/**
 * @param {undefined|null|ol.Feature} feature The feature
 * @return {undefined|ol.geom.Geometry} The geom
 */
const mapFeatureToGeometry = function(feature) {
  return feature ? feature.getGeometry() : undefined;
};

/**
 * Map a tree node to a layer.
 *
 * @param {undefined|null|os.structs.ITreeNode} node The tree node.
 * @return {os.layer.ILayer|undefined} layer The layer, or undefined if not a layer node.
 */
const mapNodeToLayer = function(node) {
  return node instanceof os.data.LayerNode ? node.getLayer() : undefined;
};

/**
 * Map tree node(s) to layers.
 *
 * @param {Array<os.structs.ITreeNode>|os.structs.ITreeNode|undefined} nodes The tree nodes.
 * @return {!Array<!os.layer.ILayer>} layers The layers.
 */
const nodesToLayers = function(nodes) {
  if (!nodes) {
    return [];
  }

  if (!goog.isArray(nodes)) {
    nodes = [nodes];
  }

  return nodes.map(mapNodeToLayer).filter(filterFalsey);
};

/**
 * An empty function that accepts no arguments.
 * Useful for features that offer optional callbacks.
 * @return {undefined}
 */
const noop = function() {
  // No Operation
};

exports = {
  filterFalsey,
  reduceExtentFromLayers,
  reduceExtentFromGeometries,
  reduceAltitudeExtentFromGeometries,
  mapLayerToSource,
  mapFeatureToGeometry,
  mapNodeToLayer,
  nodesToLayers,
  noop
};
