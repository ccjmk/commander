import Command from '../command';
import openCompendiumCommand from './openCompendium';
import allArgsCommand from './examples/allArgsExample';
import booleanArgCommand from './examples/booleanArgExample';
import numberArgCommand from './examples/numberArgExample';
import requireCreateActorsPermissionCommand from './examples/permissionsCreateActorExample';
import rawArgCommand from './examples/rawArgExample';
import onlyAllowTrustedCommand from './examples/roleTrustedExample';
import stringArgCommand from './examples/stringArgExample';
import openMacroCommand from './openMacro';
import editMacroCommand from './editMacro';
import newCommand from './new';
import newOwnedCommand from './newOwned';
import openSheetByNameCommand from './openSheetByName';
import openSheetByPlayerCommand from './openSheetByPlayer';
import showAllowedCommand from './showAllowedCommands';

const registerCommands = (register: (command: Command) => void) => {
  // TODO move these to README in JS form
  register(stringArgCommand);
  register(numberArgCommand);
  register(booleanArgCommand);
  register(rawArgCommand);
  register(allArgsCommand);
  register(onlyAllowTrustedCommand);
  register(requireCreateActorsPermissionCommand);

  register(newCommand);
  register(newOwnedCommand);
  register(openSheetByNameCommand);
  register(openSheetByPlayerCommand);
  register(openCompendiumCommand);
  register(openMacroCommand);
  register(editMacroCommand);
  register(showAllowedCommand);
};

export default registerCommands;
