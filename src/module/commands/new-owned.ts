import { createActor } from '../utils/actorUtils';
import Command from '../Command';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const newOwnedCommand: Command = {
  name: 'new:owned',
  schema: 'new:owned $entity $name $owner',
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
    const ownerUser = getGame().users!.getName(owner);
    if (!ownerUser) {
      const msg = 'Owner does not exist';
      ui.notifications?.error(msg);
      throw new Error(msg);
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
