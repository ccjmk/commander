import Command from '../commandsHandler';
import { ARGUMENT_TYPES } from '../constants';

export const infoCommand: Command = {
  name: 'info',
  scheme: 'info $input',
  args: [
    {
      name: 'input',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ input }) => {
    ui.notifications?.info(input);
  },
};
