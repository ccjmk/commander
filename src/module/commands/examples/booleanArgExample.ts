import Command from '../../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../../utils/moduleUtils';

const booleanArgCommand: Command = {
  name: 'bool',
  namespace: MODULE_NAMESPACE,
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
