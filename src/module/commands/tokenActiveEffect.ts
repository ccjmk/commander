import Command from '../command';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const tokenActiveEffectCommand: Command = {
  name: 'tae',
  namespace: MODULE_NAMESPACE,
  description: 'Gives the token an effect from CONFIG.statusEffects',
  schema: 'tae $effect',
  args: [
    {
      name: 'effect',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Object.values(CONFIG.statusEffects).map((c) => ({
          content: getGame().i18n.localize(c.label),
          img: c.icon,
        }));
      },
    },
  ],
  handler: async ({ effect }) => {
    if (getGame().canvas.tokens?.controlled.length === 0) {
      ui.notifications?.error('no token selected');
      return;
    }

    const ae = Object.values(CONFIG.statusEffects).find((e) => getGame().i18n.localize(e.label) === effect);
    if (!ae) {
      ui.notifications?.error(`Could not find ActiveEffect from name '${effect}'`);
      return;
    }
    const tokens = getGame().canvas.tokens?.controlled ?? [];
    tokens.forEach((t) => (t.document as any).toggleActiveEffect({ id: ae.id, label: ae.label, icon: ae.icon }));
  },
};
export default tokenActiveEffectCommand;
