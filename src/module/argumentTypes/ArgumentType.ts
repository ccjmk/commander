import { ARGUMENT_TYPES } from '../utils/moduleUtils';

export interface ArgumentType {
  type: ARGUMENT_TYPES;
  replace: string;
  last?: boolean;
  transform: (regexMatch: string) => any;
}
