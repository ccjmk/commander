import Command from '../command';
import openCompendiumCommand from './openCompendium';
import runMacroCommand from './runMacro';
import openPcByNameCommand from './openPcByName';
import openPcByPlayerCommand from './openPcByPlayer';
import openNpcByNameCommand from './openNpcByName';
import helpCommand from './help';
import tabCommand from './goToTab';
import infoCommand from './info';
import tokenActiveEffectCommand from './tokenActiveEffect';

const registerCommands = (register: (command: Command, replace: boolean, silentError: boolean) => void) => {
  register(openPcByNameCommand, false, true);
  register(openPcByPlayerCommand, false, true);
  register(openNpcByNameCommand, false, true);
  register(openCompendiumCommand, false, true);
  register(runMacroCommand, false, true);
  register(helpCommand, false, true);
  register(tabCommand, false, true);
  register(infoCommand, false, true);
  register(tokenActiveEffectCommand, false, true);
};

export default registerCommands;
