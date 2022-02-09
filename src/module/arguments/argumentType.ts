import { ARGUMENT_TYPES } from '../utils/moduleUtils';

export default interface ArgumentType {
  type: ARGUMENT_TYPES;
  replace: string;
  last?: boolean;
  transform: (regexMatch: string) => any;
}
