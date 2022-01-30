import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testRawCommand: Command = {
  name: 'raw',
  scheme: 'raw $value',
  args: [
    {
      name: 'value',
      type: ARGUMENT_TYPES.RAW,
    },
  ],
  handler: ({ value }) => {
    ui.notifications?.info(`[${value}]`);
  },
};
export default testRawCommand;
