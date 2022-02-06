import headerHtml from './header-html';

class Header {
  render() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = headerHtml;
    return header;
  }

  addListeners() {
    const hamburger = document.querySelector('.hamburger');
    const asideMenu = document.querySelector('.navbar-aside');
    hamburger?.addEventListener('click', () => {
      asideMenu?.classList.toggle('active');
    });
  }
}
export default Header;
