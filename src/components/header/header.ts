import headerHtml from './header-html';
import LoginPopup from '../../pages/authorization/authorization';

class Header {
  render() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = headerHtml;
    return header;
  }

  addListeners = () => {
    const openPopup = <HTMLButtonElement>document.querySelector('.open-popup');
    openPopup.addEventListener('click', () => {
      const loginPopup = new LoginPopup();
      loginPopup.render();
    });
  };
}
export default Header;
