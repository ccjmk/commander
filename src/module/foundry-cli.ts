/**
 * Author: Iñaki "ccjmk" Guastalli
 * Content License: See CONTENT-LICENSE
 * Software License: See LICENSE
 */

import { registerSettings } from './settingsConfig';
import { preloadTemplates } from './preloadTemplates';
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

let handler: CommandHandler;

// Initialize module
Hooks.once('init', async () => {
  console.log(`${MODULE_NAME} | Initializing foundry-cli`);

  handler = new CommandHandler();
  handler.register(testStringCommand);
  handler.register(testQuotedCommand);
  handler.register(testNumberCommand);
  handler.register(testIntegerCommand);
  handler.register(newCommand);
  handler.register(newOwnedCommand);
  handler.register(sheetByNameCommand);
  handler.register(sheetByPlayerCommand);

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();
});

// Setup module
Hooks.once('setup', async () => {
  setKeybindings(handler);

  (window as any).cli = {
    commands: handler.commands,
    register: handler.register,
    execute: handler.execute,
  };
});

// When ready
Hooks.once('ready', async () => {
  // Add CLI public api
});

// Add any additional hooks if necessary
