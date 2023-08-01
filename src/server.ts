import 'dotenv/config';
import App from './app';

const PORT = process.env.PORT || 4545;

new App().start(PORT);