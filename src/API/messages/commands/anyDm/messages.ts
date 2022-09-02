import { links } from 'src/config';

const messages = {
  applied: `
You have already given me your wallet address. There is nothing else for you to do here! Make sure to contribute to Gearbox DAO, see some of the tasks ${links.TASKS_LINK}.
  `,
  notInSnapshot: `
Hey, it seems like your nickname is not on the list. All the info and details can be found ${links.DETAILS_LINK}. Do not ask in Discord “why” you are not on it, because the link above mentions all the criteria.

There are no new drop stages, as Gearbox is now in control of the community DAO! If you would like to become a contributor and help grow the protocol, check ${links.CONTRIBUTION_LINK}.
  `,
  inSnapshot: `
Hey, seems like you are eligible for the early Discord drop, congrats! Send me your Ethereum wallet address. Some rules for you to know: 

- Do not send your exchange wallet address, because then you GEARs will be lost 
- Once submitted, you can’t change the address. Please be careful with what you paste below
  `,
} as const;

export { messages };
