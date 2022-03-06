import Command from '../command';
import { hasRole } from '../commandHandler';
import { ARGUMENT_TYPES, getGame } from '../utils/moduleUtils';

const openCompendiumCommand: Command = {
  name: 'comp',
  description: 'Opens a compendium by title',
  schema: 'comp $title',
  args: [
    {
      name: 'title',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return getGame().packs.map((p) => ({ content: p.title }));
      },
    },
  ],
  allow: () => hasRole('GAMEMASTER'),
  handler: ({ title }) => {
    const c = getGame().packs.find((p) => p.title.localeCompare(title, undefined, { sensitivity: 'base' }) === 0);
    if (!c) {
      ui.notifications?.error(`Unable to find compendium pack with title [${title}]`);
      return;
    }
    new Compendium(c).render(true);
  },
};
export default openCompendiumCommand;
