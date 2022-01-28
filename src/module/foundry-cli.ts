/**
 * Author: Iñaki "ccjmk" Guastalli
 * Content License: See CONTENT-LICENSE
 * Software License: See LICENSE
 */

import { registerSettings } from './settingsConfig';
import { preloadTemplates } from './preloadTemplates';
import { MODULE_NAME } from './constants';
import { setKeybindings } from './keybindingConfig';
import { Handler } from './commandsHandler';
import { infoCommand } from './commands/info';

let handler: Handler;

// Initialize module
Hooks.once('init', async () => {
  console.log(`${MODULE_NAME} | Initializing foundry-cli`);
  handler = new Handler();
  handler.register(infoCommand);

  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();
});

// Setup module
Hooks.once('setup', async () => {
  setKeybindings(handler);
});

// When ready
Hooks.once('ready', async () => {
  // Add CLI public api
  (window as any).cli = {
    register: handler.register,
    commands: handler.commands,
    execute: handler.execute,
  };
});

// Add any additional hooks if necessary
