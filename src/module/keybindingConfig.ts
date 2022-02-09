import { getSetting, SETTING } from './settingsConfig';
import { getGame, localize, MODULE_NAME, MODULE_NAMESPACE } from './utils/moduleUtils';
import Widget from './widget';

const { CONTROL } = KeyboardManager.MODIFIER_KEYS;

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
      if (getSetting(SETTING.ONLY_GM) && !getGame().user?.isGM) {
        if (getSetting(SETTING.DEBUG)) {
          console.log(`${MODULE_NAME} | ` + localize('Debug.NoGmAttempt'));
        }
        return;
      }
      widget.render(true);
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
};
