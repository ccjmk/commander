import Command from '../command';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const openSheetByPlayerCommand: Command = {
  name: 'sheet:player',
  description: 'opens/closes the character sheet of the actor a given player controls.',
  schema: 'sheet:player $player',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
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
export default openSheetByPlayerCommand;
