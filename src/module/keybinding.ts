import { getGame, localize, MODULE_NAME, MODULE_NAMESPACE, getSetting, SETTING } from './utils/moduleUtils';
import Commander from './commanderApplication';

const { ALT } = KeyboardManager.MODIFIER_KEYS;

export const registerKeybindings = (widget: Commander) => {
  getGame().keybindings.register(MODULE_NAMESPACE, 'openCommander', {
    name: localize('Keybindings.Name'),
    hint: localize('Keybindings.Hint'),
    editable: [
      {
        key: 'Backquote',
        modifiers: [ALT],
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
