import { createActor } from '../actorUtils';
import Command from '../Command';
import { ARGUMENT_TYPES } from '../constants';

const newOwnedCommand: Command = {
  name: 'new:owned',
  scheme: 'new:owned $entity $name $owner',
  args: [
    {
      name: 'entity',
      type: ARGUMENT_TYPES.STRING,
    },
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
    },
    {
      name: 'owner',
      type: ARGUMENT_TYPES.STRING,
    },
  ],
  handler: async ({ entity, name, owner }) => {
    const ownerUser = (game as any).users.getName(owner); // FIXME type this
    if (!ownerUser) {
      ui.notifications?.error('Owner does not exist');
      return;
    }
    switch (entity) {
      case 'actor':
        await createActor(name, ownerUser.id);
        break;
      default:
        ui.notifications?.error('Unrecognized entity type');
    }
  },
};
export default newOwnedCommand;
