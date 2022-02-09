import Command from '../../command';
import { hasRole } from '../../commandHandler';

const onlyAllowTrustedCommand: Command = {
  name: 'onlyTrusted',
  schema: 'onlyTrusted',
  args: [],
  allow: hasRole('TRUSTED'),
  handler: () => {
    ui.notifications?.info(`You are a Trusted player, therefore you can run this command.`);
  },
};
export default onlyAllowTrustedCommand;
