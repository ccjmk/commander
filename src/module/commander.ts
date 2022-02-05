/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
 * Content License: See CONTENT-LICENSE
 * Software License: See LICENSE
 */

import { registerSettings } from './settingsConfig';
import { registerKeybindings } from './keybindingConfig';
import CommandHandler, { hasRole } from './CommandHandler';
import newCommand from './commands/new';
import newOwnedCommand from './commands/new-owned';
import sheetByNameCommand from './commands/sheet-player';
import sheetByPlayerCommand from './commands/sheet-name';
import Widget from './widget';
import allArgsCommand from './commands/examples/all-args';
import { getGame, MODULE_NAME, MODULE_NAMESPACE } from './utils';
import stringArgCommand from './commands/examples/string-arg';
import numberArgCommand from './commands/examples/number-arg';
import booleanArgCommand from './commands/examples/boolean-arg';
import rawArgCommand from './commands/examples/raw-arg';
import onlyAllowTrustedCommand from './commands/examples/role-trusted';
import requireCreateActorsPermissionCommand from './commands/examples/permissions-create-actor';

let widget: Widget;

Hooks.once('setup', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);

  const handler = new CommandHandler();

  // TODO move these to README in JS form
  handler.register(stringArgCommand);
  handler.register(numberArgCommand);
  handler.register(booleanArgCommand);
  handler.register(rawArgCommand);
  handler.register(allArgsCommand);
  handler.register(onlyAllowTrustedCommand);
  handler.register(requireCreateActorsPermissionCommand);

  handler.register(newCommand);
  handler.register(newOwnedCommand);
  handler.register(sheetByNameCommand);
  handler.register(sheetByPlayerCommand);

  widget = new Widget(handler);

  const { commands, register, execute } = handler;
  const module = getGame().modules.get(MODULE_NAMESPACE) as any;
  if (module) {
    module.api = { commands, register, execute };
    module.helpers = { hasRole };
  }
  registerSettings();
  registerKeybindings(widget);
  Hooks.callAll('commanderReady', (window as any).commander);
});
