import { MODULE_NAME, getGame, localize } from './utils';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const setKeybindings = (onDown: () => void) => {
  getGame().keybindings.register(MODULE_NAME, 'openCommander', {
    name: localize('Keybindings.Name'),
    hint: localize('Keybindings.Hint'),
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
