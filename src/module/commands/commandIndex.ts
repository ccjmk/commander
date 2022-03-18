import Command from '../command';
import openCompendiumCommand from './openCompendium';
import runMacroCommand from './runMacro';
import openSheetByNameCommand from './openSheetByName';
import openSheetByPlayerCommand from './openSheetByPlayer';
import showAllowedCommand from './showAllowedCommands';
import goTabCommand from './goTab';
import suggestionsCommand from './examples/suggestionsExample';
import infoCommand from './info';
import tokenActiveEffectCommand from './tokenActiveEffect';

const registerCommands = (register: (command: Command, replace: boolean, silentError: boolean) => void) => {
  register(openSheetByNameCommand, false, true);
  register(openSheetByPlayerCommand, false, true);
  register(openCompendiumCommand, false, true);
  register(runMacroCommand, false, true);
  register(showAllowedCommand, false, true);
  register(goTabCommand, false, true);
  register(infoCommand, false, true);
  register(tokenActiveEffectCommand, false, true);

  register(suggestionsCommand, false, true); // TODO delete after testing
};

export default registerCommands;
