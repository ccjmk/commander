import { argumentMap } from './argumentHandler';
import { ARGUMENT_TYPES, MODULE_NAME } from './constants';

export default interface Command {
  name: string;
  description?: string;
  scheme: string;
  args: Array<Argument>;
  handler: (...params: any) => any;
}

interface Argument {
  name: string;
  type: ARGUMENT_TYPES;
}

export class Handler {
  commandMap;

  constructor() {
    this.commandMap = new Map<string, Command>();
  }

  commands = () => [...this.commandMap.values()];

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

  register = (c: any, replace?: boolean) => {
    if (
      missingMandatoryField(c.name, 'name') ||
      missingMandatoryField(c.scheme, 'scheme') ||
      missingMandatoryArray(c.args, 'args')
    )
      return;
    if (this.commandMap.get(c.name) && !replace) {
      ui.notifications?.error(`Command '${c.name}' already exists`); // TODO i18n this
      return;
    }
    if (typeof c.handler !== 'function') {
      ui.notifications?.error(`Unable to register command with incorrect data - '${c.handler}' must be a function`); // TODO i18n this
      return;
    }
    for (const arg of c.args) {
      if (invalidArgument(arg)) return;
    }
    this.commandMap.set(c.name, c);
  };
}

const missingMandatoryField = (field: any, fieldName: string) => {
  if (
    field === undefined ||
    field === null ||
    ((typeof field === 'string' || field instanceof String) && field.length === 0)
  ) {
    ui.notifications?.error(`Unable to register command with incorrect data - '${fieldName}' required`); // TODO i18n this
    return true;
  }
  return false;
};

const missingMandatoryArray = (field: any, fieldName: string) => {
  if (field === undefined || field === null || (Array.isArray(field) && field.length === 0)) {
    ui.notifications?.error(`Unable to register command with incorrect data - array '${fieldName}' required`); // TODO i18n this
    return true;
  }
  return false;
};

const invalidArgument = (arg: any) => {
  if (missingMandatoryField(arg.name, 'arg.name')) return true;
  if (missingMandatoryField(arg.type, 'arg.type')) return true;
  if (!Object.values(ARGUMENT_TYPES).includes(arg.type)) {
    ui.notifications?.error(
      `Unable to register command with incorrect data - type is not a supported argument type ${Object.values(
        ARGUMENT_TYPES,
      )}`,
    ); // TODO i18n this
  }
};
