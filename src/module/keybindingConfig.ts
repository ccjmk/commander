import { getGame, localize, MODULE_ID } from './utils';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const setKeybindings = (onDown: () => void) => {
  getGame().keybindings.register(MODULE_ID, 'openCommander', {
    name: localize('Keybindings.Name'),
    hint: localize('Keybindings.Hint'),
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
