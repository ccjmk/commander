import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../utils';

const rawArg: ArgumentType = {
  type: ARGUMENT_TYPES.RAW,
  replace: ' *?(.*)',
  last: true,
  transform: (arg) => {
    console.log('on boolean transform'); // FIXME remove this
    console.log(arg);
    return arg;
  },
};
export default rawArg;
