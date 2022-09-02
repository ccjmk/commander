import Command from '../command';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const openNpcByNameCommand: Command = {
  name: 'npc',
  namespace: MODULE_NAMESPACE,
  description: 'opens/closes the character sheet of a given Non-Playing Character by name.',
  schema: 'npc $actor',
  args: [
    {
      name: 'actor',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Array.from(getGame().actors?.values() ?? [])
          .filter((a) => a.type == 'npc')
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
export default openNpcByNameCommand;
