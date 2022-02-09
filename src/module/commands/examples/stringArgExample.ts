import Command from '../../command';
import { ARGUMENT_TYPES } from '../../utils/moduleUtils';

const stringArgCommand: Command = {
  name: 'str',
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
