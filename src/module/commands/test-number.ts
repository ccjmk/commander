import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testNumberCommand: Command = {
  name: 'num',
  scheme: 'num $number',
  args: [
    {
      name: 'number',
      type: ARGUMENT_TYPES.NUMBER,
    },
  ],
  handler: ({ number }) => {
    ui.notifications?.info(`[${number}]`);
  },
};
export default testNumberCommand;
