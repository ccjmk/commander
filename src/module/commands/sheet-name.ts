import Command from '../Command';
import { ARGUMENT_TYPES, getGame } from '../utils';

const sheetByPlayerCommand: Command = {
  name: 'sheet:name',
  description: 'opens/closes the character sheet of a given actor by name.',
  schema: 'sheet:name $player',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  hasPermissions: () => true,
  handler: ({ player }) => {
    const sheet = getGame().users!.getName(player)?.character?.sheet;
    if (!sheet) {
      const msg = `Player "${player}" undefined`;
      ui.notifications?.error(msg);
      throw new Error(msg);
    }
    if ((sheet as any)._state < 1) {
      sheet.render(true);
    } else {
      sheet.close();
    }
  },
};
export default sheetByPlayerCommand;
