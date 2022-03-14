import Command from '../command';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const openSheetByPlayerCommand: Command = {
  name: 'sheet:player',
  namespace: MODULE_NAMESPACE,
  description: 'opens/closes the character sheet of the actor a given player controls.',
  schema: 'sheet:player $player',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Array.from(getGame().users?.values() ?? []).map((u) => ({ content: u.name! }));
      },
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
