import { ArgumentType } from './ArgumentType';
import integerArg from './argumentTypes/integerArg';
import numberArg from './argumentTypes/numberArg';
import quotedStringArg from './argumentTypes/quotedStringArg';
import stringArg from './argumentTypes/stringArg';
import Command from './Command';
import { ARGUMENT_TYPES, MODULE_NAME } from './constants';

const argumentMap = new Map<ARGUMENT_TYPES, ArgumentType>();
argumentMap.set(ARGUMENT_TYPES.NUMBER, numberArg);
argumentMap.set(ARGUMENT_TYPES.INTEGER, integerArg);
argumentMap.set(ARGUMENT_TYPES.STRING, stringArg);
argumentMap.set(ARGUMENT_TYPES.QUOTED_STRING, quotedStringArg);

export default class CommandHandler {
  commandMap;

  constructor() {
    this.commandMap = new Map<string, Command>();
  }

  get commands() {
    return this.commandMap;
  }

  execute = async (input: string) => {
    //check all commands
    for (const c of this.commandMap.values()) {
      let reg = c.scheme;
      for (const arg of c.args) {
        const argumentType = argumentMap.get(arg.type);
        if (argumentType === undefined) {
          ui.notifications?.error(`Unsupported argument type [${arg.type}]`); // TODO i18n this
          return;
        }
        reg = reg.replace('$' + arg.name, argumentType.replace);
      }
      const regexp = new RegExp(reg, 'ui');
      const match = input.match(regexp);
      if (match) {
        match.shift();
        const paramObj: any = {};
        for (let i = 0; i < c.args.length; i++) {
          paramObj[c.args[i].name] = argumentMap.get(c.args[i].type)?.transform(match[i]);
        }
        console.debug(`${MODULE_NAME} | Executing '${c.name}' with args: ${paramObj}`); // TODO bind to debug setting
        return await c.handler(paramObj);
      }
    }
    ui.notifications?.warn('No matching command found'); // TODO i18n this
  };

  register = (command: unknown, replace?: boolean) => {
    if (!isCommand(command)) return;
    if (this.commandMap.get(command.name) && !replace) {
      throw new Error(`Command '${command.name}' already exists`); // TODO i18n this
    }
    this.commandMap.set(command.name, command);
  };
}

function isCommand(command: any): command is Command {
  missingMandatoryField(command.name, 'name');
  missingMandatoryField(command.scheme, 'scheme');
  missingMandatoryArray(command.args, 'args');

  if (typeof command.handler !== 'function') {
    throw new Error(`Unable to register command with incorrect data - '${command.handler}' must be a function`); // TODO i18n this
  }
  for (const arg of command.args) {
    isInvalidArgument(arg);
  }
  return true;
}

const missingMandatoryField = (field: any, fieldName: string) => {
  if (
    field === undefined ||
    field === null ||
    ((typeof field === 'string' || field instanceof String) && field.length === 0)
  ) {
    throw new Error(`Unable to register command with incorrect data - '${fieldName}' required`); // TODO i18n this
  }
};

const missingMandatoryArray = (field: any, fieldName: string) => {
  if (field === undefined || field === null || (Array.isArray(field) && field.length === 0)) {
    throw new Error(`Unable to register command with incorrect data - array '${fieldName}' required`); // TODO i18n this
  }
};

const isInvalidArgument = (arg: any) => {
  missingMandatoryField(arg.name, 'arg.name');
  missingMandatoryField(arg.type, 'arg.type');
  if (!Object.values(ARGUMENT_TYPES).includes(arg.type)) {
    throw new Error(
      `Unable to register command with incorrect data - type is not a supported argument type ${Object.values(
        ARGUMENT_TYPES,
      )}`,
    ); // TODO i18n this
  }
};