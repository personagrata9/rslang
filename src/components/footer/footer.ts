import footerHtml from './footer-html';

class Footer {
  render() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = footerHtml;
    return footer;
  }
}
export default Footer;
