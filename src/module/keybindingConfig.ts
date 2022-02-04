import { getGame, localize, MODULE_NAME } from './utils';
import Widget from './widget';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const setKeybindings = (widget: Widget) => {
  getGame().keybindings.register(MODULE_NAME.toLowerCase(), 'openCommander', {
    name: localize('Keybindings.Name'),
    hint: localize('Keybindings.Hint'),
    editable: [
      {
        key: 'KeyC',
        modifiers: [SHIFT, CONTROL],
      },
    ],
    onDown: () => {
      widget.render(true);
    },
    restricted: true,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};
