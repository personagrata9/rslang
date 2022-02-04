import { createDivElement } from '../../common/utils';

class LoginPopup {
  private container: HTMLDivElement;

  constructor() {
    this.container = createDivElement('container popup-container');
  }

  private createWelcomeWrapper = (): HTMLDivElement => {
    this.container.innerHTML = '';
    const popup = createDivElement('popup');
    this.container.append(popup);
    return this.container;
  };

  render = () => {
    this.createWelcomeWrapper();
    document.body.append(this.container);
  };
}

export default LoginPopup;
