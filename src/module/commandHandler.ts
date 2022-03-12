import ArgumentType from './arguments/argumentType';
import booleanArg from './arguments/booleanArg';
import numberArg from './arguments/numberArg';
import rawArg from './arguments/rawArg';
import stringArg from './arguments/stringArg';
import Command from './command';
import Argument from './argument';
import Suggestion from './suggestion';
import { getSetting, SETTING } from './settings';
import { getCommandSchemaWithoutArguments } from './utils/commandUtils';
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
    // console.log(`${MODULE_NAME} | ${localize('Handler.RetrievingCommands')}`);
    // retrieveCommandsFromModuleSetting().forEach(c => this._register(c, false, true));
  }

  get commands(): Command[] {
    return [...this.commandMap.values()];
  }

  suggestCommand = (input: string): Command[] | undefined => {
    if (startsWithOverride(input)) return; // ignore chat rolls
    input = sanitizeInput(input);
    if (!input) return;
    input = input.toLowerCase();
    const firstSpace = input.indexOf(' ');
    const command = firstSpace < 1 ? input : input.substring(0, firstSpace);
    try {
      const allowedCommands = [...this.commandMap.values()].filter((c) => !c.allow || c.allow());
      return allowedCommands.filter((c) => c.name.toLowerCase().trim().startsWith(command.replace(/$.*/, '')));
    } catch (err) {
      console.error(err); // TODO i18n this
    }
  };

  suggestArguments = (input: string): Suggestion[] | undefined => {
    if (startsWithOverride(input)) return; // ignore chat rolls
    input = sanitizeInput(input);
    const commands = this.suggestCommand(input);
    if (commands?.length != 1) return; // none or more than one command found, don't suggest arguments
    const command = commands[0];
    const inputRegex = `([a-zA-Z0-9]+|"[^"]+"|'[^']+')? *`; // search for words with or without quotes (single or double) followed by an optional space
    const regex =
      escapeCharactersForRegex(getCommandSchemaWithoutArguments(command)) +
      ' *' +
      inputRegex.repeat(command.args.length);
    const tokensWithCmd = input.match(regex)?.filter(Boolean) ?? [];
    if (!tokensWithCmd.length) return;

    const offset = input.endsWith(' ') ? 0 : 1; // if no space at the end, we show suggestions from Nth argument, else we want to show suggestions for Nth+1 argument
    const argumentTokens = [...tokensWithCmd].splice(1);
    const arg = command.args[argumentTokens.length - offset];

    if (arg?.suggestions || arg?.type === ARGUMENT_TYPES.BOOLEAN) {
      const filter = !input.endsWith(' ') ? argumentTokens.at(-1) : undefined;
      try {
        const suggs =
          arg?.type === ARGUMENT_TYPES.BOOLEAN
            ? ['true', 'on', 'false', 'off'].map((s) => ({ content: s }))
            : arg.suggestions!();
        return filter ? suggs.filter((s) => s.content.toLowerCase().startsWith(filter.toLowerCase())) : suggs;
      } catch (err) {
        console.error(err); // TODO i18n this
      }
    }
  };

  execute = async (input: string) => {
    Hooks.callAll('commanderExecute', input);
    const debugMode = getSetting(SETTING.DEBUG);

    if (getSetting(SETTING.ONLY_GM) && !getGame().user?.isGM) {
      ui.notifications?.error(localize('Handler.Exec.NoGmAttempt'));
      return;
    }

    if (startsWithOverride(input)) {
      // send to chat directly
      if (input.startsWith(':')) input = input.substring(1); // if starts with : remove it to send the text only
      // @ts-expect-error processMessage marked as protected
      ui.chat?.processMessage(input); // send input to be processed by foundry
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
      try {
        return await command.handler(paramObj);
      } catch (err) {
        console.error(err); // TODO i18n
      }
    } else {
      ui.notifications?.warn(localize('Handler.Exec.ArgumentsDontMatch', { commandName: command.name }));
    }
  };

  register = (command: unknown, replace?: boolean) => {
    this._register(command, replace, false);
  };

  _register = (command: unknown, replace?: boolean, silentError?: boolean) => {
    const debugMode = getSetting(SETTING.DEBUG);

    if (!isValidCommand(command)) return;
    if (this.commandMap.get(command.name) && !replace) {
      if (debugMode) console.warn(localize('Handler.Reg.DebugNotReplaced', { commandName: command.name }));
      if (silentError) return;
      throw new Error(localize('Handler.Reg.CommandAlreadyExists', { commandName: command.name }));
    }
    this.regexCache.set(command, buildRegex(command.schema, command.args));
    this.commandMap.set(command.name.trim(), command);
    // persistCommandInLocalStorage(command);
    if (debugMode) console.log(localize('Handler.Reg.CommandRegistered', { commandName: command.name }));
  };

  private getCommand(input: string): Command | undefined {
    const firstSpace = input.indexOf(' ');
    const commandName = (firstSpace != -1 ? input.substring(0, firstSpace) : input).toLowerCase().trim();
    return this.commandMap.get([...this.commandMap.keys()].find((c) => c.toLowerCase().trim() === commandName) ?? '');
  }
}

const sanitizeInput = (input: string) => {
  // TODO remove extra spaces not between quotes
  return input;
};

const buildRegex = (schema: Command['schema'], args: Command['args']) => {
  let reg = schema;
  for (const arg of args) {
    const argumentType = argumentMap.get(arg.type)!;
    reg = reg.replace('$' + arg.name, argumentType.replace);
  }
  return reg;
};

function startsWithOverride(input: string) {
  return input.startsWith('/') || input.startsWith(':');
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
  const g = getGame();
  if (!g || !g.permissions) return false;
  return checkedPermissions.every((p) => g.permissions![p].includes(g.user!.role));
};

export const hasRole = (role: keyof typeof CONST.USER_ROLES) => {
  if (!isValidRole(role)) throw new Error(localize('Handler.Reg.InvalidRole', { role }));
  return getGame().user?.hasRole(role) ?? false;
};

function isValidRole(role: string): role is keyof typeof CONST.USER_ROLES {
  return Object.keys(CONST.USER_ROLES).includes(role);
}

function isValidPermission(permission: string): permission is keyof typeof CONST.USER_PERMISSIONS {
  return Object.keys(CONST.USER_PERMISSIONS).includes(permission);
}
function escapeCharactersForRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
