import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const testBooleanCommand: Command = {
  name: 'bool',
  scheme: 'bool $bool',
  args: [
    {
      name: 'bool',
      type: ARGUMENT_TYPES.BOOLEAN,
    },
  ],
  handler: ({ bool }) => {
    ui.notifications?.info(`[${bool}]`);
  },
};
export default testBooleanCommand;