import Command from '../command';

export function getCommandSchemaWithoutArguments(command: Command) {
  const argumentStart = command.schema.indexOf(' ');
  return command.schema.substring(0, argumentStart > 0 ? argumentStart : command.schema.length);
}
