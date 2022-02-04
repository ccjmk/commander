import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const testBooleanCommand: Command = {
  name: 'bool',
  schema: 'bool $bool',
  args: [
    {
      name: 'bool',
      type: ARGUMENT_TYPES.BOOLEAN,
    },
  ],
  hasPermissions: () => true,
  handler: ({ bool }) => {
    ui.notifications?.info(`[${bool}]`);
  },
};
export default testBooleanCommand;
