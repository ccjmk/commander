import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const testRawCommand: Command = {
  name: 'raw',
  schema: 'raw $value',
  args: [
    {
      name: 'value',
      type: ARGUMENT_TYPES.RAW,
    },
  ],
  hasPermissions: () => true,
  handler: ({ value }) => {
    ui.notifications?.info(`[${value}]`);
  },
};
export default testRawCommand;
