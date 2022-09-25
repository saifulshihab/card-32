# Card-32
A multiplayer card game. A player can join/create a room with a room id and username. A maximum of 4 players can join a room. At the start of the game, randomly 8 cards will be passed to each player (total of 32 cards with values 1-32). The player can bid an estimated winning point based on the cards received. Then in each round, each player gets to drop a card and the highest numbered card wins that round. 8 rounds in total. 

## Installation
Go to root dir & run the following commands to run the project on localhost:
```js
yarn
yarn lerna:bootstrap

// run project
yarn start:web (run client side)
yarn start:server (run server)
```

## Stack
- Front-End: React.js, Tailwind CSS, TypeScript
- Back-End: Express, Socket.io, TypeScript


Copyright © 2022. All Rights Reserved by Saiful Islam Shihab.
