import Command from './command';

export default interface ModuleApi {
  api?: {
    commands: Command[];
    register: (command: Command, replace?: boolean) => void;
    execute: (input: string, ...args: any[]) => any;
  };
  helpers?: {
    hasRole: (role: keyof typeof CONST.USER_ROLES) => boolean;
    hasPermissions: (...permissions: string[]) => boolean;
  };
}
