import { Configuration, MidwayConfig } from '@midwayjs/core';

export default {
  keys: '1723456658690_1396',
  koa: {
    port: 7001,
  },
  cors:{
    origin: '*',
  },
  database: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'Shule543279448',
      database: 'username',
    },
  },
} as MidwayConfig;



import * as crossDomain from '@midwayjs/cross-domain';
@Configuration({
  imports: [
    // ...other components
    crossDomain
  ],
})
export class MainConfiguration {}
