import './styles/styles.scss';
import 'bootstrap';
import App from './app/app';
import LoginPopup from './pages/authorization/authorization';

const app = new App();

window.onload = async (): Promise<void> => {
  app.start();
  await app.route();
};

window.onhashchange = async (): Promise<void> => {
  await app.route();
};

const openModalBtn = <HTMLButtonElement>document.querySelector('.openPopupBtn');

const loginPopup = new LoginPopup();

openModalBtn.addEventListener('click', loginPopup.render);
