/* eslint-disable no-restricted-globals */
const createDivElement = (className: string): HTMLDivElement => {
  const element = document.createElement('div');
  element.className = className;

  return element;
};
const checkHash = (): string => location.hash;
export { createDivElement, checkHash };
