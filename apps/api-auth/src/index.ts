import { config } from './config.js';
import { init } from './app.js';

init().listen({ host: '0.0.0.0', port: config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Server is running on ${address}`)
  }
});
