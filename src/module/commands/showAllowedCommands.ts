import Command from '../command';
import { getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const showAllowedCommand: Command = {
  name: 'cmd:allowed',
  description: 'logs to console all commands the current user is allowed to run',
  schema: 'cmd:allowed',
  args: [],
  allow: () => true, // allow for all
  handler: () => {
    const module = getGame().modules.get(MODULE_NAMESPACE) as any;
    [...module.api.commands.values()]
      .filter((c) => !c.allow || c.allow())
      .forEach((c) => {
        const cmd = c as Command;
        console.log(`${cmd.schema}${cmd.description ? '\n\t' + cmd.description : ''}`);
      });
  },
};
export default showAllowedCommand;
