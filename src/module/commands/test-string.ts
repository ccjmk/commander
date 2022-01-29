import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testStringCommand: Command = {
  name: 's',
  scheme: 's $input',
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
export default testStringCommand;
