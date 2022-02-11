import asideHtml from './aside-html';

class Aside {
  render() {
    const aside = document.createElement('nav');
    aside.className = 'navbar-aside';
    aside.innerHTML = asideHtml;
    return aside;
  }

  addListeners() {
    const sidebarLinks = document.querySelectorAll('.aside-link');
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', () => {
        localStorage.removeItem('isTextbook');
      });
    });
  }
}
export default Aside;
