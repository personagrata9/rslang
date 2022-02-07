import {
  createButtonElement,
  createDivElement,
  createFormElement,
  createHeadingElement,
  createInputElement,
} from '../../common/utils';
import Api from '../../api/api';

class LoginPopup {
  private readonly container: HTMLDivElement;

  private readonly modalTitle: HTMLHeadingElement;

  private readonly modalBody: HTMLDivElement;

  private readonly nameInput: HTMLInputElement;

  private readonly emailInput: HTMLInputElement;

  private readonly passwordInput: HTMLInputElement;

  private readonly repeatPasswordInput: HTMLInputElement;

  private readonly showPasswordBtn: HTMLInputElement;

  private readonly showPasswordTitle: HTMLSpanElement;

  private readonly showPassWrapper: HTMLDivElement;

  constructor() {
    this.container = createDivElement('container', 'modal-container');
    this.modalTitle = createHeadingElement('h5', 'Login');
    this.modalBody = createDivElement('modal-body');
    this.nameInput = createInputElement('text', 'name-input', 'Enter Name', 'form-control');
    this.emailInput = createInputElement('email', 'email-input', 'Enter email', 'form-control');
    this.passwordInput = createInputElement('password', 'password-input', 'Password', 'form-control');
    this.repeatPasswordInput = createInputElement('password', 'repeat-password-input', 'Password', 'form-control');
    this.showPasswordBtn = createInputElement('checkbox', 'passCheckbox', '', 'form-check-input', 'mt-1', 'me-1');
    this.showPasswordTitle = document.createElement('span');
    this.showPassWrapper = createDivElement('container');
  }

  private createModal = (): HTMLDivElement => {
    this.container.innerHTML = '';
    this.modalBody.innerHTML = '';
    const modal = createDivElement('modal', 'fade', 'show');
    modal.onclick = this.closeModal;
    modal.style.display = 'block';
    const modalDialog = createDivElement('modal-dialog');
    modalDialog.onclick = function stopProp(e) {
      e.stopPropagation();
    };
    const modalContent = createDivElement('modal-content');
    const modalHeader = createDivElement('modal-header');
    const closeBtn = createButtonElement('button', '', 'btn-close');
    closeBtn.addEventListener('click', this.closeModal);
    const modalFooter = createDivElement('modal-footer');
    const signBtn = createButtonElement('submit', 'Sign in', 'btn', 'btn-primary', 'btn-sign');
    const toRegBtn = createButtonElement('button', "Don't have an account? Sign Up!", 'btn', 'btn-link');
    const toSignBtn = createButtonElement('button', 'Do you have an account? Sign In!', 'btn', 'btn-link');
    const repeatPasswordLabel = document.createElement('label');
    this.showPassWrapper.append(this.showPasswordBtn, this.showPasswordTitle);
    this.showPasswordTitle.textContent = 'Show password';
    repeatPasswordLabel.textContent = 'Repeat your password';
    this.repeatPasswordInput.addEventListener('input', this.comparisonChecker);
    toRegBtn.addEventListener('click', () => {
      this.modalBody.prepend(this.registrationModal());
      this.modalBody.append(repeatPasswordLabel, this.repeatPasswordInput, this.showPassWrapper, toSignBtn);
      signBtn.textContent = 'Sign up';
      this.modalTitle.textContent = 'Register';
      toRegBtn.remove();
    });
    toSignBtn.addEventListener('click', () => {
      this.nameInput.value = '';
      signBtn.textContent = 'Sign in';
      this.createModal();
    });
    this.showPasswordBtn.onclick = this.showPassword;
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
    this.passwordInput.addEventListener('input', this.passwordChecker);
    formGroupPassword.append(passwordLabel, this.passwordInput);
    loginForm.append(formGroupEmail, formGroupPassword, this.showPassWrapper);
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
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
      target.setCustomValidity('Invalid email(example username@example.com)');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  nameChecker = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    const regexName = /^[a-zA-Zа-яА-я\s]{3,15}$/;
    if (target.value.match(regexName) == null) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
      target.setCustomValidity('Invalid name(letters only)');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  passwordChecker = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    if (target.value.toString().length < 8) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  comparisonChecker = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    if (target.value !== this.passwordInput.value) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
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
      this.closeModal();
    }
  };

  showPassword = () => {
    if (this.repeatPasswordInput.type === 'password' && this.passwordInput.type === 'password') {
      this.repeatPasswordInput.type = 'text';
      this.passwordInput.type = 'text';
    } else {
      this.repeatPasswordInput.type = 'password';
      this.passwordInput.type = 'password';
    }
  };
}

export default LoginPopup;
