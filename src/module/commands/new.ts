import { createActor } from '../utils/actorUtils';
import Command from '../command';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const newCommand: Command = {
  name: 'new',
  schema: 'new $entity $name',
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
      //TODO other entity types
      default:
        const msg = 'Unrecognized entity type';
        ui.notifications?.error(msg);
        throw new Error(msg);
    }
  },
};
export default newCommand;
