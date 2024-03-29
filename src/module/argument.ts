import ArgumentSuggestion from './argumentSuggestion';
import { ARGUMENT_TYPES } from './utils/moduleUtils';

export default interface Argument {
  name: string;
  type: ARGUMENT_TYPES;
  suggestions?: (...params: any) => ArgumentSuggestion[];
}
