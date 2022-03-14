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

    const myContent = `<h2>${command.name}</h2>
      <div><span>Namespace: </span><i>${command.namespace}</i></div>
      <hr>
      ${command.description}
      <hr>
      <div><span>Schema: </span><code>${command.schema}</code></div>
      <ol>
        <li>arg1</li>
        <li>arg2</li>
        <li>arg3</li>
      </ol>`;

    new Dialog({
      title: `Command Info > ${command?.name}`,
      content: myContent,
      buttons: {},
      default: '',
    }).render(true);
  },
};
export default infoCommand;
