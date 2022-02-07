export const createDivElement = (className: string): HTMLDivElement => {
  const element = document.createElement('div');
  element.className = className;

  return element;
};

const upgradePageInfo = (address: string): void => {
  const asideButtons = document.querySelectorAll('.aside-link');
  const namePage = document.querySelector('.page-name');
  const minigamesButton = document.querySelector('.minigames-aside');
  asideButtons.forEach((button) => {
    const buttonAttribute = button.getAttribute('href');
    button.classList.remove('active');
    if (buttonAttribute === address) {
      button.classList.add('active');
      if (namePage) {
        namePage.textContent = button.getAttribute('title');
      }
      if (address === '#audio-challenge' || address === '#sprint') {
        minigamesButton?.classList.add('active');
      }
    }
  });
};

export const checkHash = (): string => {
  const address = window.location.hash;
  upgradePageInfo(address);
  return address;
};

export const createUlElement = (className: string): HTMLUListElement => {
  const element = document.createElement('ul');
  element.className = className;

  return element;
};

export const createLiElement = (className: string): HTMLLIElement => {
  const element = document.createElement('li');
  element.className = className;

  return element;
};
