import Command from '../../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../../utils/moduleUtils';

const rawArgCommand: Command = {
  name: 'raw',
  namespace: MODULE_NAMESPACE,
  schema: 'raw $value',
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
export default rawArgCommand;
