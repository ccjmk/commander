import Command from '../command';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const editMacroCommand: Command = {
  name: 'macro:edit',
  description: 'Opens the "edit macro" window for a given macro by name',
  schema: 'macro:edit $name',
  args: [
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ name }) => {
    const macro = getGame().macros?.getName(name);
    if (!macro) {
      ui.notifications?.error(`Unable to find macro with name [${name}]`);
      return;
    }
    new MacroConfig(macro).render(true);
  },
};
export default editMacroCommand;
