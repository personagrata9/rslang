import { Methods } from './types';

export const createDivElement = (...classNames: string[]): HTMLDivElement => {
  const element = document.createElement('div');
  element.classList.add(...classNames);

  return element;
};

export const createElement = (teg: string, classNames: string[], innerText?: string): HTMLElement => {
  const element = document.createElement(teg);
  element.classList.add(...classNames);
  if (innerText) {
    element.textContent = innerText;
  }
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

export const createNavElement = (...classNames: string[]): HTMLElement => {
  const element = document.createElement('nav');
  element.classList.add(...classNames);

  return element;
};

export const createUlElement = (...classNames: string[]): HTMLUListElement => {
  const element = document.createElement('ul');
  element.classList.add(...classNames);

  return element;
};

export const createLiElement = (...classNames: string[]): HTMLLIElement => {
  const element = document.createElement('li');
  element.classList.add(...classNames);

  return element;
};

export const createHeadingElement = (
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  textContent: string,
  ...classNames: string[]
): HTMLHeadingElement => {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  element.classList.add(...classNames);

  return element;
};

export const createParagraphElement = (innerHTML: string, ...classNames: string[]): HTMLParagraphElement => {
  const element = document.createElement('p');
  element.innerHTML = innerHTML;
  element.classList.add(...classNames);

  return element;
};

export const createButtonElement = (
  type: 'button' | 'reset' | 'submit',
  textContent: string,
  ...classNames: string[]
): HTMLButtonElement => {
  const element = document.createElement('button');
  element.type = type;
  element.textContent = textContent;
  element.classList.add(...classNames);

  return element;
};

export const createFormElement = (name: string, ...classNames: string[]): HTMLFormElement => {
  const element = document.createElement('form');
  element.name = name;
  element.classList.add(...classNames);
  element.method = Methods.Post;
  element.autocomplete = 'on';

  return element;
};

export const createInputElement = (
  type: 'text' | 'email' | 'password',
  id: string,
  placeholder: string,
  ...classNames: string[]
): HTMLInputElement => {
  const element = document.createElement('input');
  element.type = type;
  element.id = id;
  element.placeholder = placeholder;
  element.classList.add(...classNames);
  element.required = true;

  return element;
};

// for audio-challenge page
export const playAudio = async (link: string) => {
  const audio = new Audio();
  audio.src = link;
  return audio;
};

export const createSelect = (valuesSelect: string[]): HTMLSelectElement => {
  const select = createElement('select', ['select-audio-rules-page']);
  select.innerHTML = '<option class="option-audio-rules-page" value="" selected disabled hidden>Level</option>';
  for (let i = 0; i < valuesSelect.length; i += 1) {
    const optionSelect = createElement('option', ['option-audio-rules-page'], valuesSelect[i]);
    optionSelect.setAttribute('value', valuesSelect[i]);
    select.append(optionSelect);
  }
  return select as HTMLSelectElement;
};
