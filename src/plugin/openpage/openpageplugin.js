goog.module('plugin.openpage.Plugin');
goog.module.declareLegacyNamespace();

const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const Handler = goog.require('plugin.openpage.Handler');


/**
 * Provides a Weather menu option when right-clicking the map. The resulting location is then
 * opened in a new tab with the configured weather URL.
 */
class Plugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.id = plugin.openpage.ID;
  }

  /**
   * @inheritDoc
   */
  init() {
    os.xt.Peer.getInstance().addHandler(new Handler());
  }
}

goog.addSingletonGetter(Plugin);


exports = Plugin;
