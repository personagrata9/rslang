import { createElement } from '../../common/utils';
import ApiPage from '../api-page';

class Sprint extends ApiPage {
  constructor() {
    super('sprint');
  }

  async render(): Promise<void> {
    const sprintGamePage = createElement('div', ['sprint-container']);
    sprintGamePage.append(this.createGame());
    this.contentContainer.append(sprintGamePage);
  }

  createGame(): HTMLElement {
    const gamePage = createElement('div', ['sprint-game-container']);
    return gamePage;
  }
}

export default Sprint;
