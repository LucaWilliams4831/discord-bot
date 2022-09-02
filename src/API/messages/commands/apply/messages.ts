import { links } from 'src/config';

const messages = {
  wrongAddress: `
It seems that you submitted your wallet address in format that I can’t understand. Please simply copy-paste the address in a regular text format. Do not send images or questions, I only need your wallet address.
  `,
  success: (amount: number) => `
Your amount of GEAR tokens: ${amount}. Stay tuned in the announcements channel ${links.ANNOUNCEMENTS} and wait for the claim process. And make sure to contribute to DAO, see some of the tasks ${links.TASKS_LINK}.
  `,
} as const;

export { messages };
