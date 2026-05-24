import http from 'node:http';
import config from './config.js';
import { handleRequest } from './routes/ads.js';

const server = http.createServer(handleRequest);

server.listen(config.port, config.host, () => {
  console.log(`lenaa-ads-api listening on http://${config.host}:${config.port}`);
  console.log(`meta configured: ${Boolean(config.meta.accessToken && config.meta.adAccountId)}`);
});
