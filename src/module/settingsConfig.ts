import { MODULE_NAME, getGame, localize } from './utils';

const namespace = MODULE_NAME.toLowerCase();
export const enum SETTING {
  DEBUG = 'debug',
  ONLY_GM = 'onlyGM',
}

export function registerSettings(): void {
  getGame().settings.register(namespace, SETTING.DEBUG, {
    name: localize('Settings.DebugMode.Name'),
    hint: localize('Settings.DebugMode.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => console.log(`${MODULE_NAME} | ${localize('Settings.DebugMode.Log', { value })}`),
  });

  getGame().settings.register(namespace, SETTING.ONLY_GM, {
    name: localize('Settings.OnlyGM.Name'),
    hint: localize('Settings.OnlyGM.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
}

export function getSetting(key: SETTING) {
  return getGame().settings.get(namespace, key);
}

export function setSetting(key: SETTING, value: any) {
  return getGame().settings.set(namespace, key, value);
}
