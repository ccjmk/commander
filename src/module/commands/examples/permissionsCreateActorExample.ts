import Command from '../../command';

const requireCreateActorsPermissionCommand: Command = {
  name: 'onlyPermissionsCreateActor',
  schema: 'onlyPermissionsCreateActor',
  args: [],
  allow: () => {
    return true;
  },
  handler: () => {
    ui.notifications?.info(`You are a Trusted player, therefore you can run this command.`);
  },
};
export default requireCreateActorsPermissionCommand;
