goog.module('plugin.params');
goog.module.declareLegacyNamespace();

const QueryData = goog.require('goog.Uri.QueryData');
const utils = goog.require('goog.uri.utils');
const osActionEventType = goog.require('os.action.EventType');
const object = goog.require('os.object');
const IUrlSource = goog.require('os.ol.source.IUrlSource');
const Request = goog.require('os.source.Request');
const osUrl = goog.require('os.url');


goog.require('os.file.File');

/**
 * Identifier for params plugin components.
 * @type {string}
 */
const ID = 'params';

/**
 * Events for the params plugin.
 * @enum {string}
 */
const EventType = {
  EDIT_PARAMS: 'params:edit'
};

/**
 * Metric keys for the params plugin.
 * @enum {string}
 */
const Metrics = {
  EDIT_PARAMS: 'params.editParams'
};

/**
 * If a URI supports parameter modification.
 *
 * @param {!goog.Uri} uri The URI.
 * @return {boolean}
 */
const isUriSupported = function(uri) {
  return uri.getScheme() !== os.file.FileScheme.FILE && uri.getScheme() !== os.file.FileScheme.LOCAL;
};

/**
 * Check if a layer supports request parameter overrides.
 *
 * @param {ol.layer.Layer} layer The layer.
 * @return {boolean} If the layer supports request parameter overrides.
 */
const supportsParamOverrides = function(layer) {
  var source = layer.getSource();
  if (source instanceof Request) {
    var request = source.getRequest();
    if (request) {
      var uri = request.getUri();
      return uri != null && isUriSupported(uri);
    }
  } else if (os.implements(layer, os.layer.ILayer.ID) && os.implements(source, IUrlSource.ID)) {
    return true;
  }

  return false;
};

/**
 * Get the request parameters for a layer.
 *
 * @param {ol.layer.Layer} layer The layer.
 * @return {Object} The request parameters.
 */
const getParamsFromLayer = function(layer) {
  var params = null;

  var source = layer.getSource();
  if (source instanceof Request) {
    var request = source.getRequest();
    if (request) {
      var uri = request.getUri();
      if (uri && isUriSupported(uri)) {
        // copy the existing params onto the object
        params = osUrl.queryDataToObject(uri.getQueryData());
      }
    }
  } else if (os.implements(source, IUrlSource.ID)) {
    source = /** @type {IUrlSource} */ (source);

    var sourceParams = source.getParams();
    if (sourceParams) {
      params = object.unsafeClone(sourceParams);
    }
  }

  return params;
};

/**
 * Set the request parameters for a layer.
 *
 * @param {ol.layer.Layer} layer The layer.
 * @param {!Object} params The new parameters.
 * @param {Array<string>=} opt_remove Keys to remove.
 */
const setParamsForLayer = function(layer, params, opt_remove) {
  var source = layer.getSource();
  if (source instanceof Request) {
    var request = source.getRequest();
    if (request) {
      var uri = request.getUri();
      if (uri && isUriSupported(uri)) {
        var qd = uri.getQueryData();
        if (!qd) {
          qd = new QueryData();
          uri.setQueryData(qd);
        }

        for (var key in params) {
          qd.set(key, params[key]);
        }

        if (opt_remove) {
          opt_remove.forEach(function(key) {
            qd.remove(key);
          });
        }

        source.refresh();
      }
    }
  } else if (os.implements(source, IUrlSource.ID)) {
    source = /** @type {IUrlSource} */ (source);

    var oldParams = source.getParams();
    if (oldParams) {
      Object.assign(oldParams, params);

      if (opt_remove) {
        opt_remove.forEach(function(key) {
          delete oldParams[key];
        });
      }

      source.updateParams(oldParams);
    }
  }
};

/**
 * Get the request URL(s) for a layer.
 *
 * @param {ol.layer.Layer} layer The layer.
 * @return {Array<string>|string|null} An array if multiple URL's are supported, string for single-URL sources,
 *                                     null if the URL could not be resolved.
 */
const getUrlsForLayer = function(layer) {
  var urls = null;

  if (layer) {
    var source = layer.getSource();
    if (source instanceof Request) {
      var request = source.getRequest();
      if (request) {
        var uri = request.getUri();
        if (uri) {
          urls = uri.toString().replace(/\?.*/, '') || null;
        }
      }
    } else if (os.implements(source, IUrlSource.ID)) {
      source = /** @type {IUrlSource} */ (source);

      var sourceUrls = source.getUrls();
      if (sourceUrls) {
        urls = sourceUrls.slice();
      }
    }
  }

  return urls;
};

/**
 * Set the request URL(s) for a layer.
 *
 * @param {ol.layer.Layer} layer The layer.
 * @param {!(Array<string>|string)} urls The URL's.
 */
const setUrlsForLayer = function(layer, urls) {
  if (layer) {
    var source = layer.getSource();
    if (source instanceof Request) {
      var url = typeof urls == 'string' ? urls : urls[0];
      var request = source.getRequest();
      if (request) {
        var uri = request.getUri();
        if (uri) {
          var m = utils.split(String(url));
          uri.setScheme(m[utils.ComponentIndex.SCHEME] || '', true);
          uri.setUserInfo(m[utils.ComponentIndex.USER_INFO] || '', true);
          uri.setDomain(m[utils.ComponentIndex.DOMAIN] || '', true);
          uri.setPort(m[utils.ComponentIndex.PORT]);
          uri.setPath(m[utils.ComponentIndex.PATH] || '', true);

          source.refresh();
        }
      }
    } else if (os.implements(source, IUrlSource.ID)) {
      source = /** @type {IUrlSource} */ (source);

      if (urls) {
        if (typeof urls == 'string') {
          source.setUrl(urls);
        } else if (urls.length > 0) {
          source.setUrls(urls);
        }
      }

      if (os.implements(layer, os.layer.ILayer.ID)) {
        /** @type {!os.layer.ILayer} */ (layer).callAction(osActionEventType.REFRESH);
      }
    }
  }
};

exports = {
  ID,
  EventType,
  Metrics,
  isUriSupported,
  supportsParamOverrides,
  getParamsFromLayer,
  setParamsForLayer,
  getUrlsForLayer,
  setUrlsForLayer
};
