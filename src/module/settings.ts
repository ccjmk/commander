import { MODULE_NAME, MODULE_NAMESPACE, getGame, localize } from './utils/moduleUtils';

export const enum SETTING {
  DEBUG = 'debug',
  ONLY_GM = 'onlyGM',
  MAX_SUGGESTIONS = 'maxSuggestions',
}

export function registerSettings(): void {
  getGame().settings.register(MODULE_NAMESPACE, SETTING.DEBUG, {
    name: localize('Settings.DebugMode.Name'),
    hint: localize('Settings.DebugMode.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => console.log(`${MODULE_NAME} | ${localize('Settings.DebugMode.Log', { value })}`),
  });

  getGame().settings.register(MODULE_NAMESPACE, SETTING.ONLY_GM, {
    name: localize('Settings.OnlyGM.Name'),
    hint: localize('Settings.OnlyGM.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  getGame().settings.register(MODULE_NAMESPACE, SETTING.MAX_SUGGESTIONS, {
    name: localize('Settings.MaxSuggestions.Name'),
    hint: localize('Settings.MaxSuggestions.Hint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 5,
  });
}

export function getSetting(key: SETTING) {
  return getGame().settings.get(MODULE_NAMESPACE, key);
}

export function setSetting(key: SETTING, value: any) {
  return getGame().settings.set(MODULE_NAMESPACE, key, value);
}
