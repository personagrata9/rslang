const createDivElement = (className: string): HTMLDivElement => {
  const element = document.createElement('div');
  element.className = className;

  return element;
};
const checkHash = (): string => window.location.hash;
export { createDivElement, checkHash };
