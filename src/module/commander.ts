/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
 * License: MIT, see LICENSE
 */

import { registerKeybindings } from './keybinding';
import CommandHandler, { hasPermissions, hasRole } from './commandHandler';

import Commander from './commanderApplication';
import { getGame, MODULE_NAME, MODULE_NAMESPACE, registerSettings, handleIntroMessage } from './utils/moduleUtils';
import registerCommands from './commands/_index';
import ModuleApi from './moduleApi';

let widget: Commander;

Hooks.once('setup', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);
  registerSettings();
  const handler = new CommandHandler();
  registerCommands(handler._register);

  widget = new Commander(handler);
  registerKeybindings(widget);

  const { commands, register, execute } = handler;
  const module: Game.ModuleData<foundry.packages.ModuleData> & ModuleApi = getGame().modules.get(MODULE_NAMESPACE)!;
  module.api = { commands, register, execute };
  module.helpers = { hasRole, hasPermissions };
});

Hooks.once('ready', () => {
  console.log(`${MODULE_NAME} | Commander ready..`);
  Hooks.callAll('commanderReady', getGame().modules.get(MODULE_NAMESPACE));
  handleIntroMessage();
});
