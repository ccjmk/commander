import Command from '../../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../../utils/moduleUtils';

const stringArgCommand: Command = {
  name: 'str',
  namespace: MODULE_NAMESPACE,
  schema: 'str $text',
  args: [
    {
      name: 'text',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: ({ text }) => {
    ui.notifications?.info(`[${text}]`);
  },
};
export default stringArgCommand;
