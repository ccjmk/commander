import { ARGUMENT_TYPES } from './constants';

export interface ArgumentType {
  type: ARGUMENT_TYPES;
  replace: string;
  transform: (regexMatch: string) => any;
}
