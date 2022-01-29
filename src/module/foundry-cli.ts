/**
 * Author: Iñaki "ccjmk" Guastalli
 * Content License: See CONTENT-LICENSE
 * Software License: See LICENSE
 */

import { registerSettings } from './settingsConfig';
import { MODULE_NAME } from './constants';
import { setKeybindings } from './keybindingConfig';
import CommandHandler from './CommandHandler';
import testStringCommand from './commands/test-string';
import newCommand from './commands/new';
import newOwnedCommand from './commands/new-owned';
import sheetByNameCommand from './commands/sheet-player';
import sheetByPlayerCommand from './commands/sheet-name';
import testQuotedCommand from './commands/test-quoted';
import testNumberCommand from './commands/test-number';
import testIntegerCommand from './commands/test-integer';
import { Widget } from './Widget';

let widget: Widget;

// Initialize module
Hooks.once('init', async () => {
  console.log(`${MODULE_NAME} | Initializing foundry-cli`);

  const handler = new CommandHandler();
  handler.register(testStringCommand);
  handler.register(testQuotedCommand);
  handler.register(testNumberCommand);
  handler.register(testIntegerCommand);
  handler.register(newCommand);
  handler.register(newOwnedCommand);
  handler.register(sheetByNameCommand);
  handler.register(sheetByPlayerCommand);

  widget = new Widget(handler);
  await widget.render();
  // TODO ver si puede ir todo en el 'init'

  // Register custom module settings
  registerSettings();

  const { commands, register, execute } = handler;
  (window as any).cli = { commands, register, execute };
});

// Setup module
Hooks.once('setup', async () => {
  setKeybindings(widget.show);
  // TODO ver si se puede registar un hook cuando el modulo esta cargado
});

// When ready
Hooks.once('ready', async () => {
  // Add CLI public api
});

// Add any additional hooks if necessary
