import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const testStringCommand: Command = {
  name: 'str',
  schema: 'str $text',
  args: [
    {
      name: 'text',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  hasPermissions: () => true,
  handler: ({ text }) => {
    ui.notifications?.info(`[${text}]`);
  },
};
export default testStringCommand;
