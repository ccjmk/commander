import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testQuotedCommand: Command = {
  name: 'q',
  scheme: 'q $input',
  args: [
    {
      name: 'input',
      type: ARGUMENT_TYPES.QUOTED_STRING,
    },
  ],
  handler: ({ input }) => {
    ui.notifications?.info(input);
  },
};
export default testQuotedCommand;
