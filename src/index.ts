import './styles/styles.scss';
import 'bootstrap';
import App from './app/app';

const app = new App();

window.onload = async (): Promise<void> => {
  app.start();
  await app.route();
};

window.onhashchange = async (): Promise<void> => {
  await app.route();
};
