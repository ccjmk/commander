import { ARGUMENT_TYPES } from './constants';

export type Argument = {
  name: string;
  type: ARGUMENT_TYPES;
};

export default interface Command {
  name: string;
  description?: string;
  scheme: string;
  args: Array<Argument>;
  handler: (...params: any) => any;
}
