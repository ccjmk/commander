import Command from '../Command';
import compendiumCommand from './compendium';
import allArgsCommand from './examples/all-args';
import booleanArgCommand from './examples/boolean-arg';
import numberArgCommand from './examples/number-arg';
import requireCreateActorsPermissionCommand from './examples/permissions-create-actor';
import rawArgCommand from './examples/raw-arg';
import onlyAllowTrustedCommand from './examples/role-trusted';
import stringArgCommand from './examples/string-arg';
import macroCommand from './macro';
import macroEditCommand from './macro-edit';
import newCommand from './new';
import newOwnedCommand from './new-owned';
import sheetByPlayerCommand from './sheet-name';
import sheetByNameCommand from './sheet-player';
import showAllowedCommand from './show-allowed';

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
  register(sheetByNameCommand);
  register(sheetByPlayerCommand);
  register(compendiumCommand);
  register(macroCommand);
  register(macroEditCommand);
  register(showAllowedCommand);
};

export default registerCommands;
