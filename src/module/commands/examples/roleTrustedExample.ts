import Command from '../../command';
import { hasRole } from '../../commandHandler';
import { MODULE_NAMESPACE } from '../../utils/moduleUtils';

const onlyAllowTrustedCommand: Command = {
  name: 'onlyTrusted',
  namespace: MODULE_NAMESPACE,
  schema: 'onlyTrusted',
  args: [],
  allow: () => hasRole('TRUSTED'),
  handler: () => {
    ui.notifications?.info(`You are a Trusted player, therefore you can run this command.`);
  },
};
export default onlyAllowTrustedCommand;
