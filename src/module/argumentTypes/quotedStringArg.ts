import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../constants';

const quotedStringArg: ArgumentType = {
  type: ARGUMENT_TYPES.QUOTED_STRING,
  replace: `(["'][a-zA-Z0-9 ]+["'])`,
  transform: (arg) => {
    console.log('on quote string transform'); // FIXME remove this
    console.log(arg);
    return arg.replace(/["']/g, '');
  },
};
export default quotedStringArg;
