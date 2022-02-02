/* eslint-disable prettier/prettier */
import './styles/styles.scss';
import 'bootstrap';
import App from './app/app';

const app = new App();
window.addEventListener('load', () => {
  app.start();
  app.route();
});
window.addEventListener('hashchange', () => app.route());
// load app.start(), app.route();
// hashchange app.route();
