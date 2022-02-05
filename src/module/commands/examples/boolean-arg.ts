import Command from '../../Command';
import { ARGUMENT_TYPES } from '../../utils';

const booleanArgCommand: Command = {
  name: 'bool',
  schema: 'bool $bool',
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
export default booleanArgCommand;
