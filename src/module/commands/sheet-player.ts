import Command from '../Command';
import { ARGUMENT_TYPES, getGame } from '../utils';

const sheetByNameCommand: Command = {
  name: 'sheet:player',
  description: 'opens/closes the character sheet of the actor a given player controls.',
  scheme: 'sheet:player $player',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ player }) => {
    const sheet = getGame().users!.getName(player)?.character?.sheet;
    if (!sheet) throw new Error(`Player "${player}" undefined`);

    if ((sheet as any)._state < 1) {
      sheet.render(true);
    } else {
      sheet.close();
    }
  },
};
export default sheetByNameCommand;
