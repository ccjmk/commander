import Command from '../Command';
import { ARGUMENT_TYPES, getGame } from '../utils';

const sheetByPlayerCommand: Command = {
  name: 'sheet:name',
  description: 'opens/closes the character sheet of a given actor by name.',
  scheme: 'sheet:name $player',
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
export default sheetByPlayerCommand;
