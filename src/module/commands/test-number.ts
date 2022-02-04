import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const testNumberCommand: Command = {
  name: 'num',
  schema: 'num $number',
  args: [
    {
      name: 'number',
      type: ARGUMENT_TYPES.NUMBER,
    },
  ],
  hasPermissions: () => true,
  handler: ({ number }) => {
    ui.notifications?.info(`[${number}]`);
  },
};
export default testNumberCommand;
