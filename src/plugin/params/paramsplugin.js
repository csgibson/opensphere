goog.module('plugin.params.ParamsPlugin');
goog.module.declareLegacyNamespace();

const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const params = goog.require('plugin.params');
const menu = goog.require('plugin.params.menu');


/**
 * Allow changing request parameters for layers in opensphere
 */
class ParamsPlugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();

    this.id = params.ID;
    this.errorMessage = null;
  }

  /**
   * @inheritDoc
   */
  disposeInternal() {
    super.disposeInternal();
    menu.layerDispose();
  }

  /**
   * @inheritDoc
   */
  init() {
    menu.layerSetup();
  }
}

goog.addSingletonGetter(ParamsPlugin);


exports = ParamsPlugin;
