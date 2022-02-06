import { ArgumentType } from './ArgumentType';
import booleanArg from './argumentTypes/booleanArg';
import numberArg from './argumentTypes/numberArg';
import rawArg from './argumentTypes/rawArg';
import stringArg from './argumentTypes/stringArg';
import Command, { Argument } from './Command';
import { getSetting, SETTING } from './settingsConfig';
import { getGame, MODULE_NAME } from './utils';
import { ARGUMENT_TYPES, localize } from './utils';

const argumentMap = new Map<ARGUMENT_TYPES, ArgumentType>();
argumentMap.set(ARGUMENT_TYPES.NUMBER, numberArg);
argumentMap.set(ARGUMENT_TYPES.STRING, stringArg);
argumentMap.set(ARGUMENT_TYPES.BOOLEAN, booleanArg);
argumentMap.set(ARGUMENT_TYPES.RAW, rawArg);

export default class CommandHandler {
  private commandMap;
  private regexCache = new WeakMap<Command, string>();

  constructor() {
    this.commandMap = new Map<string, Command>();
  }

  get commands() {
    return this.commandMap;
  }

  suggestCommand = (input: string): string[] | undefined => {
    if (!input) return undefined;
    input = input.toLowerCase();
    const firstSpace = input.indexOf(' ');
    const command = firstSpace < 1 ? input : input.substring(0, firstSpace);
    const allowedCommands = [...this.commandMap.values()].filter((c) => !c.allow || c.allow());
    return allowedCommands
      .map((c) => c.name)
      .filter((c) => c.toLowerCase().trim().startsWith(command.replace(/$.*/, '')));
  };

  execute = async (input: string) => {
    const debugMode = getSetting(SETTING.DEBUG);

    if (getSetting(SETTING.ONLY_GM) && !getGame().user?.isGM) {
      ui.notifications?.error(localize('Handler.Exec.NoGmAttempt'));
      return;
    }

    const command = this.getCommand(input);
    if (!command) {
      ui.notifications?.warn(localize('Handler.Exec.NoMatchingCommand'));
      return;
    }

    if (command.allow && !command.allow()) {
      ui.notifications?.error(localize('Handler.Exec.NotAllowed'));
      return;
    }

    const reg = this.regexCache.get(command)!; // TODO notify error if not existant ?
    if (debugMode) {
      console.log(
        `${MODULE_NAME} | ` +
          localize('Handler.Exec.DebugRegex', {
            commandName: command.name,
            regex: reg,
          }),
      );
    }
    const regexp = new RegExp(reg, 'ui');
    const match = input.match(regexp);
    if (match) {
      match.shift();
      const paramObj: { [name: string]: any } = {};
      for (let i = 0; i < command.args.length; i++) {
        const iArgType = command.args[i].type;
        if (!iArgType) throw new Error();
        paramObj[command.args[i].name] = argumentMap.get(iArgType)?.transform(match[i]);
      }
      if (debugMode) {
        console.log(
          `${MODULE_NAME} | ` +
            localize('Handler.Exec.DebugRunningWithArgs', {
              commandName: command.name,
              paramObj: JSON.stringify(paramObj),
            }),
        );
      }
      return await command.handler(paramObj);
    }
    ui.notifications?.warn(localize('Handler.Exec.ArgumentsDontMatch', { commandName: command.name }));
  };

  register = (command: unknown, replace?: boolean) => {
    if (!isValidCommand(command)) return;
    if (this.commandMap.get(command.name) && !replace) {
      throw new Error(localize('Handler.Reg.CommandAlreadyExists', { commandName: command.name }));
    }
    this.regexCache.set(command, buildRegex(command.schema, command.args));
    this.commandMap.set(command.name.trim(), command);
  };

  private getCommand(input: string): Command | undefined {
    const firstSpace = input.indexOf(' ');
    const commandName = (firstSpace != -1 ? input.substring(0, firstSpace) : input).toLowerCase().trim();
    return this.commandMap.get([...this.commandMap.keys()].find((c) => c.toLowerCase().trim() === commandName) ?? '');
  }
}

function buildRegex(schema: Command['schema'], args: Command['args']) {
  let reg = schema;
  for (const arg of args) {
    const argumentType = argumentMap.get(arg.type)!;
    reg = reg.replace('$' + arg.name, argumentType.replace);
  }
  return reg;
}

function isValidCommand(command: any): command is Command {
  isValidStringField(command.name, 'name');
  isValidStringField(command.schema, 'schema');
  isArgumentArray(command.args);
  isValidFunction(command.handler);
  isValidFunction(command.allow, 'allow');
  // TODO check if raw argument is last on schema ?
  return true;
}

const isValidStringField = (field: any, fieldName: string) => {
  if (
    field === undefined ||
    field === null ||
    ((typeof field === 'string' || field instanceof String) && field.length === 0)
  ) {
    throw new Error(localize('Handler.Reg.InvalidString', { fieldName }));
  }
};

function isArgumentArray(args: any): args is Array<Argument> {
  if (args === undefined || args === null || !Array.isArray(args)) {
    throw new Error(localize('Handler.Reg.InvalidArray'));
  }
  for (const arg of args) {
    isValidArgument(arg);
  }
  return true;
}

function isValidArgument(arg: any): arg is Argument {
  isValidStringField(arg.name, 'arg.name');
  isValidStringField(arg.type, 'arg.type');
  if (!Object.values(ARGUMENT_TYPES).includes(arg.type)) {
    throw new Error(localize('Handler.Reg.InvalidArgument', { argTypes: Object.values(ARGUMENT_TYPES) }));
  }
  return true;
}

function isValidFunction(handler: any, allow?: any) {
  if (!handler && allow) return true;
  if (typeof handler !== 'function') {
    throw new Error(localize('Handler.Reg.InvalidFunction', { function: allow ? 'command.allow' : 'command.handler' }));
  }
  // TODO somehow check that the handler has the correct arguments (no more, no less)?
}

export const hasPermissions = (...permissions: string[]) => {
  const checkedPermissions: (keyof typeof CONST.USER_PERMISSIONS)[] = [];
  for (const p of permissions) {
    if (!isValidPermission(p)) throw new Error(localize('Handler.Reg.InvalidPermission', { permission: p }));
    checkedPermissions.push(p);
  }
  return () => {
    const g = getGame();
    if (!g || !g.permissions) return false;
    return checkedPermissions.every((p) => g.permissions![p].includes(g.user!.role));
  };
};

export const hasRole = (role: string) => {
  if (!isValidRole(role)) throw new Error(localize('Handler.Reg.InvalidRole', { role }));
  return () => {
    return getGame().user?.hasRole(role) ?? false;
  };
};

function isValidRole(role: string): role is keyof typeof CONST.USER_ROLES {
  return Object.keys(CONST.USER_ROLES).includes(role);
}

function isValidPermission(permission: string): permission is keyof typeof CONST.USER_PERMISSIONS {
  return Object.keys(CONST.USER_PERMISSIONS).includes(permission);
}
