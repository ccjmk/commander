import Command from '../../command';
import { ARGUMENT_TYPES, getGame } from '../../utils/moduleUtils';

const suggestionsCommand: Command = {
  name: 'sug',
  schema: 'sug $player $level $bool',
  args: [
    {
      name: 'player',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        const users = getGame().users?.values();
        if (!users) return [];
        return [...users].map((u) => ({ displayName: u.name! }));
      },
    },
    {
      name: 'level',
      type: ARGUMENT_TYPES.NUMBER,
      suggestions: () => {
        return Array.fromRange(20).map((n) => ({ displayName: n + 1 + '' }));
      },
    },
    {
      name: 'bool',
      type: ARGUMENT_TYPES.BOOLEAN,
    },
  ],
  handler: ({ player, level, bool }) => {
    ui.notifications?.info(`player: [${player}] - level: [${level}] - bool: [${bool}]`);
  },
};
export default suggestionsCommand;
