import Command from '../command';
import ModuleApi from '../moduleApi';
import { getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const helpCommand: Command = {
  name: 'help',
  namespace: MODULE_NAMESPACE,
  description: 'logs to console all commands the current user is allowed to run',
  schema: 'help',
  args: [],
  allow: () => true, // allow for all
  handler: () => {
    const module = getGame().modules.get(MODULE_NAMESPACE) as ModuleApi;
    const commands = [...module.api!.commands.values()]
      .filter((c) => !c.allow || c.allow())
      .map((c) => {
        const cmd = c as Command;
        return `<li><b>${cmd.schema}</b>${cmd.description ? ' - ' + cmd.description : ''}</li>`;
      })
      .join('');
    ui.sidebar!.activateTab('chat');
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: 'Commander' }),
      blind: true,
      content: `<h2>Commander Help</h2>
      <p>You can type 'i {command}' in the Commander input to show more info about a single command</p>
      <p>All commands allowed listed below:</p>
      <ul>
      ${commands}
      </ul>
      `,
    });
  },
};
export default helpCommand;
