import { getGame, localize, MODULE_NAMESPACE } from './utils';
import Widget from './widget';

const { ALT, CONTROL, SHIFT } = KeyboardManager.MODIFIER_KEYS;

export const registerKeybindings = (widget: Widget) => {
  getGame().keybindings.register(MODULE_NAMESPACE, 'openCommander', {
    name: localize('Keybindings.Name'),
    hint: localize('Keybindings.Hint'),
    editable: [
      {
        key: 'Backquote',
        modifiers: [CONTROL],
      },
    ],
    onDown: () => {
      widget.render(true);
    },
    restricted: true,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};
