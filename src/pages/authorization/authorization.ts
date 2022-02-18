import { createButtonElement, createElement, createFormElement, createInputElement } from '../../common/utils';
import Api from '../../api/api';

class LoginPopup {
  private readonly container: HTMLElement;

  private readonly modalTitle: HTMLElement;

  private readonly modalBody: HTMLElement;

  private readonly nameInput: HTMLInputElement;

  private readonly emailInput: HTMLInputElement;

  private readonly passwordInput: HTMLInputElement;

  private readonly repeatPasswordInput: HTMLInputElement;

  private readonly showPasswordBtn: HTMLInputElement;

  private readonly showPasswordTitle: HTMLSpanElement;

  private readonly showPassWrapper: HTMLElement;

  private readonly loginForm: HTMLFormElement;

  private readonly formGroupName: HTMLElement;

  private readonly formGroupEmail: HTMLElement;

  private signBtn: HTMLButtonElement;

  constructor() {
    this.container = createElement('div', ['container', 'modal-container']);
    this.modalTitle = createElement('h5', [], 'Login');
    this.modalBody = createElement('div', ['modal-body']);
    this.nameInput = createInputElement('text', 'name-input', 'Enter Name', 'form-control');
    this.emailInput = createInputElement('email', 'email-input', 'Enter email', 'form-control');
    this.passwordInput = createInputElement('password', 'password-input', 'Password', 'form-control');
    this.repeatPasswordInput = createInputElement(
      'password',
      'repeat-password-input',
      'Repeat password',
      'form-control'
    );
    this.showPasswordBtn = createInputElement('checkbox', 'passCheckbox', '', 'form-check-input', 'mt-1', 'me-1');
    this.showPasswordTitle = createElement('span', [], 'Show password');
    this.showPassWrapper = createElement('div', ['container']);
    this.loginForm = createFormElement('login', 'login-form');
    this.formGroupName = createElement('div', ['form-group']);
    this.formGroupEmail = createElement('div', ['form-group']);
    this.signBtn = createButtonElement('submit', 'Sign in', 'btn', 'btn-primary', 'btn-sign');
  }

  private createModal = (): HTMLElement => {
    const modal = createElement('div', ['modal', 'fade', 'show']);
    modal.onmousedown = this.closeModal;
    modal.style.display = 'block';
    const modalDialog = createElement('div', ['modal-dialog']);
    if (document.body.children.length !== 4) {
      modal.style.animation = 'none';
      modalDialog.style.animation = 'none';
    } else {
      modalDialog.style.animation = 'popupOpen 1s linear';
      modal.style.animation = 'shadow 1s linear';
    }
    modalDialog.onmousedown = (e) => e.stopPropagation();
    const modalContent = createElement('div', ['modal-content']);
    const modalHeader = createElement('div', ['modal-header']);
    const closeBtn = createButtonElement('button', '', 'btn-close');
    closeBtn.addEventListener('click', this.closeModal);
    const modalFooter = createElement('div', ['modal-footer']);
    this.signBtn.setAttribute('disabled', '');
    const toRegBtn = createButtonElement('button', "Don't have an account? Sign Up!", 'btn', 'btn-link');
    const toSignBtn = createButtonElement('button', 'Do you have an account? Sign In!', 'btn', 'btn-link');
    const repeatPasswordLabel = createElement('label', [], 'Repeat your password');
    this.showPassWrapper.append(this.showPasswordBtn, this.showPasswordTitle);
    this.repeatPasswordInput.oninput = (e) => {
      this.comparisonChecker(e);
      this.unlockSignBtn();
    };
    toRegBtn.addEventListener('click', () => {
      this.clearInputs();
      this.loginForm.prepend(this.registrationModal());
      this.showPassWrapper.remove();
      this.loginForm.append(repeatPasswordLabel, this.repeatPasswordInput, this.showPassWrapper, toSignBtn);
      this.signBtn.textContent = 'Sign up';
      this.modalTitle.textContent = 'Register';
      toRegBtn.remove();
    });
    toSignBtn.addEventListener('click', () => {
      this.clearInputs();
      modal.remove();
      this.formGroupEmail.innerHTML = '';
      this.formGroupName.innerHTML = '';
      this.loginForm.innerHTML = '';
      this.signBtn.textContent = 'Sign in';
      toSignBtn.remove();
      this.createModal();
    });
    this.showPasswordBtn.onclick = this.showPassword;
    this.signBtn.setAttribute('form', 'login');
    this.modalBody.append(this.loginModal(), toRegBtn);
    this.signBtn.onclick = this.registerOrLogin;
    this.modalTitle.textContent = 'Login';
    modalHeader.append(this.modalTitle, closeBtn);
    modalFooter.append(this.signBtn);
    modalContent.append(modalHeader, this.modalBody, modalFooter);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    this.container.append(modal);
    return this.container;
  };

  private loginModal = (): HTMLElement => {
    const emailLabel = createElement('label', [], 'Email Address');
    emailLabel.setAttribute('for', 'email-input');
    const formGroupPassword = createElement('div', ['form-group']);
    const passwordLabel = createElement('label', [], 'Password');
    passwordLabel.setAttribute('for', 'password-input');
    this.emailInput.oninput = (e) => {
      this.mailChecker(e);
      this.unlockSignBtn();
    };
    this.formGroupEmail.append(emailLabel, this.emailInput);
    this.passwordInput.oninput = (e) => {
      this.passwordChecker(e);
      this.unlockSignBtn();
    };
    formGroupPassword.append(passwordLabel, this.passwordInput);
    this.loginForm.append(this.formGroupEmail, formGroupPassword, this.showPassWrapper);
    return this.loginForm;
  };

  private registrationModal = (): HTMLElement => {
    const nameLabel = createElement('label', [], 'Name');
    nameLabel.setAttribute('for', 'name-input');
    this.nameInput.oninput = (e) => {
      this.nameChecker(e);
      this.unlockSignBtn();
    };
    this.formGroupName.append(nameLabel, this.nameInput);
    return this.formGroupName;
  };

  render = (): void => {
    this.createModal();
    document.body.append(this.container);
  };

  private closeModal = (): void => {
    const modalDialog = <HTMLElement>document.querySelector('.modal-dialog');
    const fade = <HTMLElement>document.querySelector('.fade');
    modalDialog.style.animation = 'popupClose 1s linear';
    fade.style.animation = 'unShadow 1s linear';
    setTimeout(() => this.container.remove(), 900);
  };

  private mailChecker = (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    const regexEmail = /([0-9a-z_-]{3,15})+(@)+([a-z]{4,20}\.[a-z]{2,4}$)/i;
    if (target.value.match(regexEmail) == null) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  private nameChecker = (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    const regexName = /^[a-zA-Zа-яА-я\s]{3,15}$/;
    if (target.value.match(regexName) == null) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  private passwordChecker = (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    const passwordLength = 8;
    if (target.value.toString().length < passwordLength) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  private comparisonChecker = (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    if (target.value !== this.passwordInput.value) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
    } else {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    }
  };

  unlockSignBtn = () => {
    if (document.body.contains(this.repeatPasswordInput)) {
      if (
        this.repeatPasswordInput.classList.contains('is-valid') &&
        this.passwordInput.classList.contains('is-valid') &&
        this.nameInput.classList.contains('is-valid') &&
        this.emailInput.classList.contains('is-valid')
      ) {
        this.signBtn.removeAttribute('disabled');
      } else {
        this.signBtn.setAttribute('disabled', '');
      }
    } else if (this.passwordInput.classList.contains('is-valid') && this.emailInput.classList.contains('is-valid')) {
      this.signBtn.removeAttribute('disabled');
    } else {
      this.signBtn.setAttribute('disabled', '');
    }
  };

  private registerOrLogin = async (): Promise<void> => {
    let user;
    const api = new Api();
    if (this.nameInput.value !== '') {
      user = {
        name: this.nameInput.value,
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };
      this.emailInput.style.border = '';
      await api.createUser(user).catch(() => {
        this.emailInput.style.border = 'red 2px solid';
      });
      await api.loginUser({ email: this.emailInput.value, password: this.passwordInput.value });
      this.closeModal();
      setTimeout(() => window.location.reload(), 900);
    } else {
      user = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };
      await api
        .loginUser(user)
        .then(() => {
          this.closeModal();
          setTimeout(() => window.location.reload(), 900);
        })
        .catch((response: Response) => {
          if (response) {
            this.emailInput.style.border = 'red 2px solid';
            this.passwordInput.style.border = 'red 2px solid';
            if (!this.loginForm.querySelector('.error')) {
              const errorSpan = createElement('span', ['error'], 'Incorrect email or password');
              this.loginForm.append(errorSpan);
            }
          }
        });
    }
  };

  private showPassword = (): void => {
    if (this.repeatPasswordInput.type === 'password' && this.passwordInput.type === 'password') {
      this.repeatPasswordInput.type = 'text';
      this.passwordInput.type = 'text';
    } else {
      this.repeatPasswordInput.type = 'password';
      this.passwordInput.type = 'password';
    }
  };

  private clearInputs = (): void => {
    [this.emailInput, this.passwordInput, this.repeatPasswordInput, this.nameInput].forEach((e) => {
      e.value = '';
      e.classList.remove('is-valid');
      e.classList.remove('is-invalid');
    });
    this.signBtn.setAttribute('disabled', '');
  };
}

export default LoginPopup;
