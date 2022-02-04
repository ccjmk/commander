/**
 * Authors: Iñaki "ccjmk" Guastalli, Miguel Galante
 * Content License: See CONTENT-LICENSE
 * Software License: See LICENSE
 */

import { registerSettings } from './settingsConfig';
import { registerKeybindings } from './keybindingConfig';
import CommandHandler from './CommandHandler';
import testStringCommand from './commands/test-string';
import newCommand from './commands/new';
import newOwnedCommand from './commands/new-owned';
import sheetByNameCommand from './commands/sheet-player';
import sheetByPlayerCommand from './commands/sheet-name';
import testNumberCommand from './commands/test-number';
import Widget from './widget';
import testBooleanCommand from './commands/test-boolean';
import testRawCommand from './commands/test-raw';
import testAllCommand from './commands/test-all';
import { getGame, MODULE_NAME, MODULE_NAMESPACE } from './utils';

let widget: Widget;

// Initialize module
Hooks.once('init', async () => {
  console.log(`${MODULE_NAME} | Initializing..`);

  const handler = new CommandHandler();
  handler.register(testStringCommand);
  handler.register(testNumberCommand);
  handler.register(testBooleanCommand);
  handler.register(testRawCommand);
  handler.register(testAllCommand);

  handler.register(newCommand);
  handler.register(newOwnedCommand);
  handler.register(sheetByNameCommand);
  handler.register(sheetByPlayerCommand);

  widget = new Widget(handler);

  const { commands, register, execute } = handler;
  const module = getGame().modules.get(MODULE_NAMESPACE) as any;
  if (module) {
    module.api = { commands, register, execute };
  }
  registerSettings();
  registerKeybindings(widget);
  Hooks.callAll('commanderReady', (window as any).commander);
});
