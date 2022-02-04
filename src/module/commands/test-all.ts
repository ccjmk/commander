import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const testAllCommand: Command = {
  name: 'this',
  schema: 'this $command $has $all $types',
  args: [
    {
      name: 'command',
      type: ARGUMENT_TYPES.STRING,
    },
    {
      name: 'has',
      type: ARGUMENT_TYPES.NUMBER,
    },
    {
      name: 'all',
      type: ARGUMENT_TYPES.BOOLEAN,
    },
    {
      name: 'types',
      type: ARGUMENT_TYPES.RAW,
    },
  ],
  hasPermissions: () => true,
  handler: ({ text }) => {
    ui.notifications?.info(`[${text}]`);
  },
};
export default testAllCommand;
