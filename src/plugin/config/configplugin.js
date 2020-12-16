goog.module('plugin.config.Plugin');
goog.module.declareLegacyNamespace();

const ConfigDescriptor = goog.require('os.data.ConfigDescriptor');
const ProviderEntry = goog.require('os.data.ProviderEntry');
const AbstractPlugin = goog.require('os.plugin.AbstractPlugin');
const config = goog.require('plugin.config');
const Provider = goog.require('plugin.config.Provider');


goog.require('os.data.DataManager');

/**
 * Provides config support
 */
class Plugin extends AbstractPlugin {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.id = config.ID;
  }

  /**
   * @inheritDoc
   */
  init() {
    var dm = os.dataManager;

    dm.registerProviderType(new ProviderEntry(
        config.ID, Provider, 'config Provider',
        'config servers provide layers through layer configs'));

    dm.registerDescriptorType(ConfigDescriptor.ID, ConfigDescriptor);
  }
}

goog.addSingletonGetter(Plugin);


exports = Plugin;
