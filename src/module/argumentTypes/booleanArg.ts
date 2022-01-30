import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../utils';

const booleanArg: ArgumentType = {
  type: ARGUMENT_TYPES.BOOLEAN,
  replace: '(true|false|on|off)',

  transform: (arg) => {
    console.log('on boolean transform'); // FIXME remove this
    console.log(arg);
    return arg === 'true' || arg === 'on';
  },
};
export default booleanArg;
