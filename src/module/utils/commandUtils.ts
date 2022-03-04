import Command from '../command';

export function getCommandSchemaWithoutArguments(command: Command) {
  const argumentStart = command.schema.indexOf(' ');
  return command.schema.substring(0, argumentStart > 0 ? argumentStart : command.schema.length);
}

export function persistCommandInModuleSetting(command: Command) {
  const serializedCommand = JSON.stringify(command, replacer, 2);
  // save to module settings
}

export function retrieveCommandsFromModuleSetting(): Command[] {
  // get serialized commands from module settings
  const serializedCommand = `{\n  "name": "tae",\n  "description": "Token Active Effect",\n  "schema": "tae $effect",\n  "args": [\n    {\n      "name": "effect",\n      "type": "string",\n      "suggestions": "() => {\\n        // ...\\n        return listOfActiveEffects; // get this somehow, needs to be an array of objects with {displayName: string}\\n      }"\n    }\n  ],\n  "handler": "async ({effect}) => {\\n      const tokenNotSelected = () => { /*implement this*/ }\\n      if(tokenNotSelected()) {\\n        ui.notifications.error('no token selected');\\n        return;\\n      }\\n      const getActiveEffect = () => { /* implement this using the effect, returning {id, label, icon} */ }\\n      const ae = getActiveEffect();\\n      await game.canvas.tokens.controlled[0].document.toggleActiveEffect({id: ae.id, label: ae.label, icon: ae.icon})\\n    }"\n}`;

  const command = JSON.parse(serializedCommand, reviver);

  return [command];
}

/**
 *
 * @param key
 * @param value
 * @returns
 */
const replacer = (key: string, value: unknown) => {
  return typeof value === 'function' ? value.toString() : value;
};

/**
 *
 * @param key
 * @param value
 * @returns
 */
const reviver = (key: string, value: string) => {
  return ['handler', 'allow', 'suggestions'].includes(key) ? new Function(`(${value})`) : value;
};
