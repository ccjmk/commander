import { ARGUMENT_TYPES } from './utils';

export interface ArgumentType {
  type: ARGUMENT_TYPES;
  replace: string;
  last?: boolean;
  transform: (regexMatch: string) => any;
}
