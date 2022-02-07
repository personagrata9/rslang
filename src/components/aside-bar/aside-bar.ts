import asideHtml from './aside-html';

class Aside {
  render() {
    const aside = document.createElement('nav');
    aside.className = 'navbar-aside';
    aside.innerHTML = asideHtml;
    return aside;
  }
}
export default Aside;
