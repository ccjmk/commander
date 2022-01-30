import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testStringCommand: Command = {
  name: 'str',
  scheme: 'str $text',
  args: [
    {
      name: 'text',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ text }) => {
    ui.notifications?.info(`[${text}]`);
  },
};
export default testStringCommand;
