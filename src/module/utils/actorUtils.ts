import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';

const MYSTERY_MAN = 'icons/svg/mystery-man.svg';

export const createActor = async (name: string, ownerId?: string) => {
  const actorData: ActorDataConstructorData = {
    name: name,
    type: 'character',
    img: MYSTERY_MAN,
    token: {
      actorLink: true,
      disposition: 1,
      img: MYSTERY_MAN,
      vision: true,
      dimSight: 0,
      bar1: { attribute: 'attributes.hp' },
      displayBars: 0,
      displayName: 0,
    },
  };
  if (ownerId) {
    actorData.permission = { [ownerId]: CONST.DOCUMENT_PERMISSION_LEVELS.OWNER };
  }
  const actor = await Actor.create(actorData);
  actor?.sheet?.render(true);
};
