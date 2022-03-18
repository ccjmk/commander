import Command from '../command';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const runMacroCommand: Command = {
  name: 'm',
  namespace: MODULE_NAMESPACE,
  description: 'Executes a macro by name',
  schema: 'm $name',
  args: [
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Array.from(getGame().macros?.values() ?? []).map((u) => ({ content: u.name! }));
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
