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
    const loginPopup = new LoginPopup();
    const openPopup = <HTMLButtonElement>document.querySelector('.open-popup');
    openPopup.addEventListener('click', loginPopup.render);
  };
}
export default Header;
