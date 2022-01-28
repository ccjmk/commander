import { ArgumentType } from '../argumentHandler';
import { ARGUMENT_TYPES } from '../constants';

const stringArg: ArgumentType = {
  type: ARGUMENT_TYPES.STRING,
  replace: '([a-zA-Z0-9]+)',
  transform: (arg) => {
    console.log('on string transform'); // FIXME remove this
    console.log(arg);
    return arg;
  },
};
export default stringArg;
