/**
 * Utility to register plugins and common namespace for keeping reference to all plugins classes
 */

export {registerPlugin, getPlugin};

const registeredPlugins = new WeakMap();

/**
 * Registers plugin under given name
 *
 * @param {String} pluginName
 * @param {Function} PluginClass
 */
function registerPlugin(pluginName, PluginClass) {
  Handsontable.hooks.add('construct', function () {
    var holder;

    pluginName = pluginName.toLowerCase();

    if (!registeredPlugins.has(this)) {
      registeredPlugins.set(this, {});
    }
    holder = registeredPlugins.get(this);

    if (!holder[pluginName]) {
      holder[pluginName] = new PluginClass(this);
    }
  });
  Handsontable.hooks.add('afterDestroy', function () {
    var i, pluginsHolder;

    if (registeredPlugins.has(this)) {
      pluginsHolder = registeredPlugins.get(this);

      for (i in pluginsHolder) {
        if (pluginsHolder.hasOwnProperty(i)) {
          pluginsHolder[i].destroy();
        }
      }
      registeredPlugins.delete(this);
    }
  });
}

/**
 * @param {Object} instance
 * @param {String|Function} pluginName
 * @returns {Function} pluginClass Returns plugin instance if exists or `undefined` if not exists.
 */
function getPlugin(instance, pluginName) {
  if (typeof pluginName != 'string'){
    throw Error('Only strings can be passed as "plugin" parameter');
  }
  let _pluginName = pluginName.toLowerCase();

  if (!registeredPlugins.has(instance) || !registeredPlugins.get(instance)[_pluginName]) {
    return void 0;
  }

  return registeredPlugins.get(instance)[_pluginName];
}
