import { createActor } from '../actorUtils';
import Command from '../Command';
import { ARGUMENT_TYPES } from '../utils';

const newCommand: Command = {
  name: 'new',
  scheme: 'new $entity $name',
  args: [
    {
      name: 'entity',
      type: ARGUMENT_TYPES.STRING,
    },
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: async ({ entity, name }) => {
    switch (entity) {
      case 'actor':
        await createActor(name);
        break;
      default:
        ui.notifications?.error('Unrecognized entity type');
    }
  },
};
export default newCommand;
