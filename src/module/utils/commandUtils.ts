import Command from '../command';

const LS_KEY = 'commander-commands';

export function getCommandSchemaWithoutArguments(command: Command) {
  const argumentStart = command.schema.indexOf(' ');
  return command.schema.substring(0, argumentStart > 0 ? argumentStart : command.schema.length);
}

export function persistCommandInLocalStorage(command: Command) {
  const serializedCommand = JSON.stringify(command, replacer, 0);
  const key = `cmd-${getCommandSchemaWithoutArguments(command)}`;

  const storedCommands = new Map(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'));
  storedCommands.set(key, serializedCommand);
  localStorage.setItem(LS_KEY, JSON.stringify([...storedCommands]));
}

export function retrieveCommandsFromModuleSetting(): Command[] {
  const storedCommands = new Map(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'));
  return Array.from(storedCommands.values()).map((serializedCommand) =>
    JSON.parse(serializedCommand as string, reviver),
  );
}

const replacer = (key: string, value: unknown) => {
  return typeof value === 'function' ? value.toString() : value;
};

const reviver = (key: string, value: string) => {
  return ['handler', 'allow', 'suggestions'].includes(key) ? new Function(`(${value})`) : value;
};
