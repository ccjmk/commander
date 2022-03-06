import Command from '../command';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const runMacroCommand: Command = {
  name: 'macro',
  description: 'executes a macro by name',
  schema: 'macro $name',
  args: [
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Array.from(getGame().macros?.values() ?? []).map((u) => ({ displayName: u.name! }));
      },
    },
  ],
  handler: ({ name }) => {
    const macro = getGame().macros?.getName(name);
    if (!macro) {
      ui.notifications?.error(`Unable to find macro with name [${name}]`);
      return;
    }
    macro.execute();
  },
};
export default runMacroCommand;
