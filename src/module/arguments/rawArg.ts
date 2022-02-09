import ArgumentType from './argumentType';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const rawArg: ArgumentType = {
  type: ARGUMENT_TYPES.RAW,
  replace: ' *?(.*)',
  last: true,
  transform: (arg) => arg,
};
export default rawArg;
