import Command from '../../command';
import { ARGUMENT_TYPES } from '../../utils/moduleUtils';

const numberArgCommand: Command = {
  name: 'num',
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
