import { IWord, Methods } from './types';

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
  type: 'text' | 'email' | 'password' | 'checkbox',
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

export const createAnchorElement = (href: string, innerHTML: string, ...classNames: string[]): HTMLAnchorElement => {
  const element = document.createElement('a');
  element.href = href;
  element.innerHTML = innerHTML;
  element.classList.add(...classNames);

  return element;
};

export const playAudio = async (link: string) => {
  const audio = new Audio();
  audio.src = link;
  await audio.play();
};

export const random = (maxNum: number) => {
  const randomNumber = Math.floor(Math.random() * maxNum);
  return randomNumber;
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

function addKeyboard() {
  const event = new Event('click');
  window.addEventListener('keydown', (e) => {
    const repearButton = document.querySelector('.box-audio-button');
    const repeatButtonSmall = document.querySelector('.box-audio-button-small');
    const buttonNextWord = document.querySelector('.button-next-word');
    if (e.code === 'Space') {
      repearButton?.dispatchEvent(event);
      repeatButtonSmall?.dispatchEvent(event);
    }
    if (e.code === 'Enter') {
      buttonNextWord?.dispatchEvent(event);
    }
  });
}
addKeyboard();

export const shuffle = (array: IWord[]): IWord[] => {
  array.sort(() => Math.random() - 0.5);
  return array;
};

export const mapFromString = (value: string): Map<string, number> => {
<<<<<<< HEAD
  if (value.length) {
    const arr = value.split(',');
    const ids = arr.filter((_, i) => !(i % 2));
    const counts = arr.filter((_, i) => i % 2).map(Number);
    return new Map(ids.map((id, i) => [id, counts[i]]));
  }
  return new Map([]);
};

export const setFromString = (value: string): Set<string> => {
  if (value.length) {
    const arr = value.split(',');
    return new Set(arr);
  }
  return new Set([]);
=======
  const arr = value.split(',');
  const ids = arr.filter((_, i) => !(i % 2));
  const counts = arr.filter((_, i) => i % 2);
  return new Map(ids.map((id, i) => [id, +counts[i]]));
>>>>>>> 3d73784 (feat: add statistics state for interaction wirh localStorage)
};

export const convertDate = (date: Date): string =>
  `${date.getFullYear()}${date.getMonth().toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
