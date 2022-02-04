export const createDivElement = (className: string): HTMLDivElement => {
  const element = document.createElement('div');
  element.className = className;

  return element;
};

export const checkHash = (): string => window.location.hash;

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

export const createHeadingElement = (
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  className: string,
  textContent: string
): HTMLHeadingElement => {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent;

  return element;
};

export const createParagraphElement = (className: string, innerHTML: string): HTMLParagraphElement => {
  const element = document.createElement('p');
  element.className = className;
  element.innerHTML = innerHTML;

  return element;
};
