import Command from '../../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../../utils/moduleUtils';

const numberArgCommand: Command = {
  name: 'num',
  namespace: MODULE_NAMESPACE,
  schema: 'num $number',
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
export default numberArgCommand;
