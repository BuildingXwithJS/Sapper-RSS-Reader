import * as sapper from '@sapper/server';
import compression from 'compression';
import express from 'express';
import sirv from 'sirv';
import apiRouter from './server/api';

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const server = express();

server.use(express.json());
server.use(compression({threshold: 0}));
server.use(sirv('static', {dev}));

server.use('/api', apiRouter());

server.use(sapper.middleware());

server.listen(PORT, err => {
  if (err) console.log('error', err);
});
