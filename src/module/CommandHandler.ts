import { ArgumentType } from './ArgumentType';
import booleanArg from './argumentTypes/booleanArg';
import numberArg from './argumentTypes/numberArg';
import rawArg from './argumentTypes/rawArg';
import stringArg from './argumentTypes/stringArg';
import Command, { Argument } from './Command';
import { ARGUMENT_TYPES, MODULE_NAME } from './constants';

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
    return [...this.commandMap.keys()].filter((c) => c.startsWith(input.replace(/$.*/, '')));
  };

  execute = async (input: string) => {
    const command = this.getCommand(input);
    if (!command) {
      ui.notifications?.warn(`No matching command found`); // TODO i18n this
      return;
    }

    const reg = this.regexCache.get(command)!; // TODO notify error if not existant ?
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
      console.debug(`${MODULE_NAME} | Executing '${command.name}' with args: ${paramObj}`); // TODO bind to debug setting
      return await command.handler(paramObj);
    }
    ui.notifications?.warn(`Arguments don't match for command ${command.name}`); // TODO i18n this
  };

  register = (command: unknown, replace?: boolean) => {
    if (!isValidCommand(command)) return;
    if (this.commandMap.get(command.name) && !replace) {
      throw new Error(`Command '${command.name}' already exists`); // TODO i18n this
    }
    this.regexCache.set(command, buildRegex(command.scheme, command.args));
    this.commandMap.set(command.name, command);
  };

  private getCommand(input: string): Command | undefined {
    const firstSpace = input.indexOf(' ');
    const commandName = (firstSpace != -1 ? input.substring(0, firstSpace) : input).toLowerCase();
    return this.commandMap.get(commandName);
  }
}

function buildRegex(scheme: Command['scheme'], args: Command['args']) {
  let reg = scheme;
  for (const arg of args) {
    const argumentType = argumentMap.get(arg.type)!;
    reg = reg.replace('$' + arg.name, argumentType.replace);
  }
  return reg;
}

function isValidCommand(command: any): command is Command {
  isValidStringField(command.name, 'name');
  isValidStringField(command.scheme, 'scheme');
  isArgumentArray(command.args);
  isValidHandler(command.handler);
  // TODO check if raw argument is last on schema ?
  return true;
}

const isValidStringField = (field: any, fieldName: string) => {
  if (
    field === undefined ||
    field === null ||
    ((typeof field === 'string' || field instanceof String) && field.length === 0)
  ) {
    throw new Error(`Unable to register command with incorrect data - '${fieldName}' required`); // TODO i18n this
  }
};

function isArgumentArray(args: any): args is Array<Argument> {
  if (args === undefined || args === null || !Array.isArray(args)) {
    throw new Error(`Unable to register command with incorrect data - array 'args' required`); // TODO i18n this
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
    throw new Error(
      `Unable to register command with incorrect data - type is not a supported argument type ${Object.values(
        ARGUMENT_TYPES,
      )}`,
    ); // TODO i18n this
  }
  return true;
}

function isValidHandler(handler: any) {
  if (typeof handler !== 'function') {
    throw new Error(`Unable to register command with incorrect data - 'command.handler' must be a function`); // TODO i18n this
  }
  // TODO somehow check that the handler has the correct arguments (no more, no less)?
}
