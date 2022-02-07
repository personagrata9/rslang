import headerHtml from './header-html';

class Header {
  render() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = headerHtml;
    return header;
  }
}
export default Header;
