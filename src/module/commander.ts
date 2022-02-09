/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
 * License: MIT, see LICENSE
 */

import { registerSettings } from './settingsConfig';
import { registerKeybindings } from './keybindingConfig';
import CommandHandler, { hasPermissions, hasRole } from './commandHandler';

import Widget from './widget';
import { getGame, MODULE_NAME, MODULE_NAMESPACE } from './utils/moduleUtils';
import registerCommands from './commands';

let widget: Widget;

Hooks.once('setup', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);

  const handler = new CommandHandler();
  registerCommands(handler.register);
  widget = new Widget(handler);

  const { commands, register, execute } = handler;
  const module = getGame().modules.get(MODULE_NAMESPACE) as any;
  if (module) {
    module.api = { commands, register, execute };
    module.helpers = { hasRole, hasPermissions };
  }
  registerSettings();
  registerKeybindings(widget);
  Hooks.callAll('commanderReady', module);
});
