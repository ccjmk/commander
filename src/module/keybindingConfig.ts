import { MODULE_NAME } from './constants';
import { Widget } from './Widget';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const setKeybindings = (onDown: () => void) => {
  // FIXME type this properly
  (game as any).keybindings.register(MODULE_NAME, 'openCli', {
    name: 'Open', // TODO i18n this
    hint: 'Opens the Foundry CLI input.', // TODO i18n this
    namespace: MODULE_NAME,
    editable: [
      {
        key: 'KeyC',
        modifiers: [SHIFT, CONTROL],
      },
    ],
    onDown,
    restricted: true,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};