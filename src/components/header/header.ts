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
    const openPopupBtn = <HTMLButtonElement>document.querySelector('.open-popup');
    const userName = <HTMLElement>document.querySelector('.user-name');
    const logoutBtn = <HTMLButtonElement>document.querySelector('.logout');
    userName.innerHTML = `Hello, <span>${<string>localStorage.getItem('UserName') || 'guest'}</span>!`;
    openPopupBtn.addEventListener('click', () => {
      const loginPopup = new LoginPopup();
      loginPopup.render();
    });
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('UserName');
      localStorage.removeItem('UserToken');
      localStorage.removeItem('UserRefreshToken');
      localStorage.removeItem('UserId');
      window.location.reload();
    });
    if (localStorage.getItem('UserName')) {
      logoutBtn.classList.remove('hide');
      openPopupBtn.classList.add('hide');
    }
  };
}
export default Header;
