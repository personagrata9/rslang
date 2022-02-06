import { createButtonElement, createDivElement, createFormElement, createInputElement } from '../../common/utils';
import Api from '../../api/api';

class LoginPopup {
  private container: HTMLDivElement;

  private modalTitle: HTMLHeadingElement;

  private modalBody: HTMLDivElement;

  private nameInput: HTMLInputElement;

  private emailInput: HTMLInputElement;

  private passwordInput: HTMLInputElement;

  constructor() {
    this.container = createDivElement('container', 'modal-container');
    this.modalTitle = document.createElement('h5');
    this.modalBody = createDivElement('modal-body');
    this.nameInput = createInputElement('text', 'name-input', 'Enter Name', 'form-control');
    this.emailInput = createInputElement('email', 'email-input', 'Enter email', 'form-control');
    this.passwordInput = createInputElement('password', 'password-input', 'Password', 'form-control');
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
    const repeatPasswordLabel = document.createElement('label');
    // const showPasswordBtn = createInputElement('radio', 'passCheckbox');
    repeatPasswordLabel.textContent = 'Repeat your password';
    const repeatPasswordInput = createInputElement('password', 'password-input', 'Password', 'form-control');
    toRegBtn.addEventListener('click', () => {
      this.modalBody.prepend(this.registrationModal());
      this.modalBody.append(repeatPasswordLabel);
      this.modalBody.append(repeatPasswordInput);
      this.modalBody.append(toSignBtn);
      toRegBtn.remove();
    });
    toSignBtn.addEventListener('click', () => {
      this.nameInput.value = '';
      repeatPasswordLabel.remove();
      repeatPasswordInput.remove();
      this.createModal();
    });
    signBtn.setAttribute('form', 'login');
    this.modalBody.append(this.loginModal(), toRegBtn);
    signBtn.onclick = this.registerOrLogin;
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
    const formGroupPassword = createDivElement('form-group');
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password-input');
    passwordLabel.textContent = 'Password';
    this.emailInput.addEventListener('input', this.mailChecker);
    formGroupEmail.append(emailLabel, this.emailInput);
    formGroupPassword.append(passwordLabel, this.passwordInput);
    loginForm.append(formGroupEmail, formGroupPassword);
    return loginForm;
  };

  registrationModal = () => {
    const formGroupName = createDivElement('form-group');
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name-input');
    nameLabel.textContent = 'Name';
    this.nameInput.oninput = this.nameChecker;
    formGroupName.append(nameLabel, this.nameInput);
    return formGroupName;
  };

  render = () => {
    this.createModal();
    document.body.append(this.container);
  };

  closeModal = () => {
    this.container.innerHTML = '';
  };

  mailChecker = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    const regexEmail = /([0-9a-z_-]{3,15})+(@)+([a-z]{4,20}\.[a-z]{2,4}$)/i;
    if (target.value.match(regexEmail) == null) {
      target.classList.add('redBorder');
      target.setCustomValidity('Invalid email(example username@example.com)');
    } else {
      target.classList.remove('redBorder');
    }
  };

  nameChecker = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    const regexName = /^[a-zA-Zа-яА-я\s]{3,15}$/;
    if (target.value.match(regexName) == null) {
      target.classList.add('redBorder');
      target.setCustomValidity('Invalid name(letters only)');
    } else {
      target.classList.remove('redBorder');
    }
  };

  registerOrLogin = async () => {
    let user;
    if (this.nameInput.value !== '') {
      user = {
        name: this.nameInput.value,
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };

      const api = new Api();
      this.emailInput.style.border = '';
      await api.createUser(user).catch(() => {
        this.emailInput.style.border = 'red 2px solid';
      });
    } else {
      user = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };
      const api = new Api();
      await api.loginUser(user);
    }
  };
}

export default LoginPopup;
