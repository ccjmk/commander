import Command from '../../command';
import { MODULE_NAMESPACE } from '../../utils/moduleUtils';

const requireCreateActorsPermissionCommand: Command = {
  name: 'onlyPermissionsCreateActor',
  namespace: MODULE_NAMESPACE,
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
