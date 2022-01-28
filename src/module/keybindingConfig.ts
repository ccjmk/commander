import { Handler } from './commandsHandler';
import { MODULE_NAME } from './constants';
import Widget from './widget';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const setKeybindings = (handler: Handler) => {
  // FIXME type this properly
  (game as any).keybindings.register(MODULE_NAME, 'openCli', {
    name: 'Open',
    hint: 'Opens the Foundry CLI input.', // TODO i18n this
    namespace: MODULE_NAME,
    editable: [
      {
        key: 'KeyC',
        modifiers: [SHIFT, CONTROL],
      },
    ],
    onDown: (context: any) => {
      console.log(context);
      new Widget(handler).render(true);
    },
    restricted: true,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};
