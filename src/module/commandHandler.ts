import ArgumentType from './arguments/argumentType';
import booleanArg from './arguments/booleanArg';
import numberArg from './arguments/numberArg';
import rawArg from './arguments/rawArg';
import stringArg from './arguments/stringArg';
import Command, { Argument } from './command';
import { getSetting, SETTING } from './settingsConfig';
import { getGame, MODULE_NAME } from './utils/moduleUtils';
import { ARGUMENT_TYPES, localize } from './utils/moduleUtils';

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
    Hooks.callAll('commanderExecute', input);
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
    console.log(localize('Handler.Reg.CommandRegistered', { commandName: command.name }));
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

function isValidCommand(command: unknown): command is Command {
  if (!isNotNullObject(command)) {
    throw 'Command is not an object';
  }

  isValidStringField(command, 'name');
  isValidStringField(command, 'schema');
  isArgumentArray(command);
  isValidFunction(command, 'handler');
  isValidFunction(command, 'allow');
  // TODO check if raw argument is last on schema ?
  return true;
}

const isNotNullObject = (obj: unknown): obj is object => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

/**
 * Type guard: Checks if given object x has the key.
 */
const has = <K extends string>(key: K, x: object): x is { [key in K]: unknown } => key in x;

const isValidStringField = (command: object, fieldName: string, fieldDescription?: string) => {
  if (has(fieldName, command)) {
    const field = command[fieldName];

    if (isString(field) && field.length > 0) {
      return true;
    }
  }
  throw new Error(localize('Handler.Reg.InvalidString', { fieldName: fieldDescription || fieldName }));
};

const isString = (str: unknown): str is string => typeof str === 'string' || str instanceof String;

function isArray(array: unknown): array is Array<unknown> {
  if (array === undefined || array === null || !Array.isArray(array)) {
    return false;
  }
  return true;
}

function isArgumentArray(command: object): command is { args: Array<Argument> } {
  if (has('args', command)) {
    const args = command['args'];
    if (!isArray(args)) {
      throw new Error(localize('Handler.Reg.InvalidArray'));
    }
    for (const arg of args) {
      isValidArgument(arg);
    }
  }
  return true;
}

function isValidArgument(arg: unknown): arg is Argument {
  if (!isNotNullObject(arg)) {
    throw 'Command is not an object';
  }
  isValidStringField(arg, 'name', 'arg.name');
  isValidStringField(arg, 'type', 'arg.type');

  if (!has('type', arg)) {
    throw new Error(localize('Handler.Reg.InvalidArgument', { argTypes: Object.values(ARGUMENT_TYPES) }));
  }
  const type = arg.type;
  if (!(typeof type === 'string')) {
    throw new Error(localize('Handler.Reg.InvalidArgument', { argTypes: Object.values(ARGUMENT_TYPES) }));
  }

  if (!isString(arg.type) || !(Object.values(ARGUMENT_TYPES) as string[]).includes(arg.type)) {
    throw new Error(localize('Handler.Reg.InvalidArgument', { argTypes: Object.values(ARGUMENT_TYPES) }));
  }

  return true;
}

function isValidFunction(handler: unknown, allow?: any) {
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
