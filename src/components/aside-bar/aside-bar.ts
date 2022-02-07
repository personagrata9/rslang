import asideHtml from './aside-html';

class Aside {
  render() {
    const aside = document.createElement('nav');
    aside.className = 'navbar-aside';
    aside.innerHTML = asideHtml;
    return aside;
  }

  addListeners() {
    const asideButtons = document.querySelectorAll('.aside-link');
    const namePage = document.querySelector('.page-name');
    const minigamesButton = document.querySelector('.minigames-aside');
    asideButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonAttribute = button.getAttribute('title');
        asideButtons.forEach((btn) => btn.classList.remove('active'));
        minigamesButton?.classList.remove('active');
        button.classList.add('active');
        if (namePage) {
          namePage.textContent = buttonAttribute;
        }
        if (buttonAttribute === 'Audio-challenge' || buttonAttribute === 'Sprint') {
          minigamesButton?.classList.add('active');
        }
      });
    });
  }
}
export default Aside;
