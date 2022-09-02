import Command from '../command';
import ModuleApi from '../moduleApi';
import { ARGUMENT_TYPES, getGame, MODULE_NAMESPACE } from '../utils/moduleUtils';

const infoCommand: Command = {
  name: 'info',
  namespace: MODULE_NAMESPACE,
  description: 'Shows information about a command',
  schema: 'info $name',
  args: [
    {
      name: 'name',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        const module: Game.ModuleData<foundry.packages.ModuleData> & ModuleApi =
          getGame().modules.get(MODULE_NAMESPACE)!;
        return module.api!.commands.map((c) => ({ content: c.name! }));
      },
    },
  ],
  handler: ({ name }) => {
    const module: Game.ModuleData<foundry.packages.ModuleData> & ModuleApi = getGame().modules.get(MODULE_NAMESPACE)!;
    const command = module.api?.commands.find((c) => c.name === name);
    if (!command) {
      ui.notifications?.error(`Unable to find command with name [${name}]`);
      return;
    }

    const allowed = command.allow ? command.allow() : getGame().user?.isGM;
    const args = command.args.map((arg) => `<li>${arg.name} (${arg.type})</li>`).join('');
    const myContent = `<h2>"${command.name?.toUpperCase()}"</h2>
      <div><span>Namespace - </span><i>${command.namespace}</i></div>
      <hr>
      ${command.description ?? 'No description provided'}
      <hr>
      <div><span>Schema - </span><code>${command.schema}</code></div>
      <div><span title="Ignoring module settings override">Allowed<sup style="font-size: x-small;">?</sup> - </span>${allowed}</div>
      <div><span>Arguments</span></div>
      <ul>${args}</ul>`;

    new Dialog({
      title: `Command Info > ${command?.name}`,
      content: myContent,
      buttons: {},
      default: '',
    }).render(true);
  },
};
export default infoCommand;
