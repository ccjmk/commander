import Command from '../command';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const focusTabCommand: Command = {
  name: 'focus',
  description: 'Switches rightside tab (and focuses input for Chat tab)',
  schema: 'focus $tab',
  args: [
    {
      name: 'tab',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        return Object.keys(ui.sidebar?.tabs ?? {}).map((c) => {
          const i = 'fas fa-users';
          return { content: c, icon: c === 'cards' ? '' : i };
        });
      },
    },
  ],
  allow: () => true,
  handler: ({ tab }) => {
    ui.sidebar!.activateTab(tab);
    if (tab === 'chat') {
      (document.querySelector('textarea#chat-message') as HTMLTextAreaElement)?.focus();
    }
  },
};
export default focusTabCommand;
