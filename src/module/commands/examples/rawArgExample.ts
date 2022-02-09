import Command from '../../command';
import { ARGUMENT_TYPES } from '../../utils/moduleUtils';

const rawArgCommand: Command = {
  name: 'raw',
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
