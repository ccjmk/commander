/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
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
import testNumberCommand from './commands/test-number';
import Widget from './Widget';
import testBooleanCommand from './commands/test-boolean';
import testRawCommand from './commands/test-raw';

let widget: Widget;

// Initialize module
Hooks.once('init', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);

  const handler = new CommandHandler();
  handler.register(testStringCommand);
  handler.register(testNumberCommand);
  handler.register(testBooleanCommand);
  handler.register(testRawCommand);

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
  (window as any).commander = { commands, register, execute };
  setKeybindings(widget.show);
});

// When ready
Hooks.once('ready', async () => {
  Hooks.callAll('commanderReady', (window as any).commander);
});
