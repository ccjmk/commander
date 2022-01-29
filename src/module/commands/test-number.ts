import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testNumberCommand: Command = {
  name: 'n',
  scheme: 'n $input',
  args: [
    {
      name: 'input',
      type: ARGUMENT_TYPES.NUMBER,
    },
  ],
  handler: ({ input }) => {
    ui.notifications?.info(input);
  },
};
export default testNumberCommand;
