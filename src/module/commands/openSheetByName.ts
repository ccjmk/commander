import Command from '../command';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const openSheetByNameCommand: Command = {
  name: 'sheet:name',
  description: 'opens/closes the character sheet of a given actor by name.',
  schema: 'sheet:name $actor',
  args: [
    {
      name: 'actor',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ actor }) => {
    const sheet = getGame().users!.getName(actor)?.character?.sheet;
    if (!sheet) {
      const msg = `Actor "${actor}" undefined`;
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
export default openSheetByNameCommand;
