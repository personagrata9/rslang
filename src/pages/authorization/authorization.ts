// import { ISignUser } from '../../common/types';
// import Api from '../../api/api';

export const createDivElement = (...classNames: string[]): HTMLDivElement => {
  const element = document.createElement('div');
  element.classList.add(...classNames);

  return element;
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

class LoginPopup {
  private container: HTMLDivElement;

  private modalTitle: HTMLHeadingElement;

  private modalBody: HTMLDivElement;

  constructor() {
    this.container = createDivElement('container', 'modal-container');
    this.modalTitle = document.createElement('h5');
    this.modalBody = createDivElement('modal-body');
  }

  private createModal = (): HTMLDivElement => {
    this.container.innerHTML = '';
    this.modalBody.innerHTML = '';
    const modal = createDivElement('modal', 'fade', 'show');
    modal.addEventListener('click', this.closeModal);
    modal.style.display = 'block';
    const modalDialog = createDivElement('modal-dialog');
    modalDialog.onclick = function stopProp(e) {
      e.stopPropagation();
    };
    const modalContent = createDivElement('modal-content');
    const modalHeader = createDivElement('modal-header');
    const closeBtn = createButtonElement('button', '✖', 'close-modal-btn');
    closeBtn.addEventListener('click', this.closeModal);
    const modalFooter = createDivElement('modal-footer');
    const signBtn = createButtonElement('submit', 'Sign in', 'btn', 'btn-primary', 'btn-sign');
    const toRegBtn = createButtonElement('button', 'Sign up', 'btn', 'btn-link');
    const toSignBtn = createButtonElement('button', 'Sign in', 'btn', 'btn-link');
    toRegBtn.addEventListener('click', () => {
      this.modalBody.prepend(this.registrationModal());
      this.modalBody.append(toSignBtn);
      toRegBtn.remove();
    });
    toSignBtn.addEventListener('click', () => {
      this.createModal();
    });
    signBtn.setAttribute('form', 'login');
    this.modalBody.append(this.loginModal(), toRegBtn);
    // signBtn.addEventListener('click', () => {
    //   const user: ISignUser = {
    //     email: emailInput.value,
    //     password: passwordInput.value,
    //   };
    //   (async () => {
    //     const api = new Api();
    //     await api.loginUser(user);
    //   })();
    // });
    this.modalTitle.textContent = 'Login';
    modalHeader.append(this.modalTitle, closeBtn);
    modalFooter.append(signBtn);
    modalContent.append(modalHeader, this.modalBody, modalFooter);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    this.container.append(modal);
    return this.container;
  };

  loginModal = () => {
    const loginForm = createFormElement('login', 'login-form');
    const formGroupEmail = createDivElement('form-group');
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email-input');
    emailLabel.textContent = 'Email Address';
    const emailInput = createInputElement('email', 'email-input', 'Enter email', 'form-control');
    const formGroupPassword = createDivElement('form-group');
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password-input');
    passwordLabel.textContent = 'Password';
    const passwordInput = createInputElement('password', 'password-input', 'Password', 'form-control');
    formGroupEmail.append(emailLabel, emailInput);
    formGroupPassword.append(passwordLabel, passwordInput);
    loginForm.append(formGroupEmail, formGroupPassword);
    return loginForm;
  };

  registrationModal = () => {
    const formGroupName = createDivElement('form-group');
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name-input');
    nameLabel.textContent = 'Name';
    const nameInput = createInputElement('text', 'name-input', 'Enter Name', 'form-control');
    formGroupName.append(nameLabel, nameInput);
    return formGroupName;
  };

  render = () => {
    this.createModal();
    document.body.append(this.container);
  };

  closeModal = () => {
    this.container.innerHTML = '';
  };
}

export default LoginPopup;
