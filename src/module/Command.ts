import { ARGUMENT_TYPES } from './utils';

interface Suggestion {
  displayName: string;
}

export interface Argument {
  name: string;
  type: ARGUMENT_TYPES;
  suggestions?: (...params: any) => Suggestion[];
}

export default interface Command {
  name: string;
  description?: string;
  schema: string;
  args: Argument[];
  hasPermissions: () => boolean;
  handler: (...params: any) => any;
}
