import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const sheetByNameCommand: Command = {
  name: 'sheet:player',
  description: 'opens/closes the character sheet of the actor a given player controls.',
  scheme: 'sheet:player $player',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.QUOTED_STRING,
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
export default sheetByNameCommand;
