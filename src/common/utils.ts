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
