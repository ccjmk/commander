/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
 * License: MIT, see LICENSE
 */

import { registerSettings } from './settings';
import { registerKeybindings } from './keybinding';
import CommandHandler, { hasPermissions, hasRole } from './commandHandler';

import Widget from './widget';
import { getGame, MODULE_NAME, MODULE_NAMESPACE } from './utils/moduleUtils';
import registerCommands from './commands/commandIndex';
import ModuleApi from './moduleApi';

let widget: Widget;

Hooks.once('setup', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);
  registerSettings();
  const handler = new CommandHandler();
  registerCommands(handler._register);

  widget = new Widget(handler);
  registerKeybindings(widget);

  const { commands, register, execute } = handler;
  const module: Game.ModuleData<foundry.packages.ModuleData> & ModuleApi = getGame().modules.get(MODULE_NAMESPACE)!;
  module.api = { commands, register, execute };
  module.helpers = { hasRole, hasPermissions };
});

Hooks.once('ready', () => {
  console.log(`${MODULE_NAME} | Commander ready..`);
  Hooks.callAll('commanderReady', module);
});
