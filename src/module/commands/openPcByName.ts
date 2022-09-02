import Command from '../command';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const openPcByNameCommand: Command = {
  name: 'pc',
  namespace: MODULE_NAMESPACE,
  description: 'opens/closes the character sheet of a given Player Character by name.',
  schema: 'pc $actor',
  args: [
    {
      name: 'actor',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Array.from(getGame().actors?.values() ?? [])
          .filter((a) => a.type == 'character')
          .map((a) => ({ content: a.name! }));
      },
    },
  ],
  handler: ({ actor }) => {
    const sheet = getGame().actors!.getName(actor)?.sheet;
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
export default openPcByNameCommand;
