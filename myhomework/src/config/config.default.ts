import {MidwayConfig } from '@midwayjs/core';

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


