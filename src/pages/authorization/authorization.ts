import { createDivElement } from '../../common/utils';

class LoginPopup {
  private container: HTMLDivElement;

  private modalTitle: HTMLHeadingElement;

  constructor() {
    this.container = createDivElement('container modal-container');
    this.modalTitle = document.createElement('h5');
  }

  private createLoginModal = (): HTMLDivElement => {
    this.container.innerHTML = '';
    const modal = createDivElement('modal');
    modal.classList.add('fade', 'show');
    modal.addEventListener('click', this.closeModal);
    modal.style.display = 'block';
    const modalDialog = createDivElement('modal-dialog');
    // const modalContent = createDivElement('modal-content');
    // const modalHeader = createDivElement('modal-header');
    // const modalBody = createDivElement('modal-body');
    // const modalFooter = createDivElement('modal-footer');
    this.modalTitle.textContent = 'Login';
    modalDialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button">&times;
        </button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>`;
    modal.append(modalDialog);
    this.container.append(modal);
    return this.container;
  };

  render = () => {
    this.createLoginModal();
    document.body.append(this.container);
  };

  closeModal = () => {
    this.container.innerHTML = '';
  };
}

export default LoginPopup;
