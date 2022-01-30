import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

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
    const sheet = (game as any).users.getName(player).character.sheet; // FIXME type this

    if (sheet._state < 1) {
      sheet.render(true);
    } else {
      sheet.close();
    }
  },
};
export default sheetByPlayerCommand;
