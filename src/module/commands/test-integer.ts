import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testIntegerCommand: Command = {
  name: 'i',
  scheme: 'i $input',
  args: [
    {
      name: 'input',
      type: ARGUMENT_TYPES.INTEGER,
    },
  ],
  handler: ({ input }) => {
    ui.notifications?.info(input);
  },
};
export default testIntegerCommand;
