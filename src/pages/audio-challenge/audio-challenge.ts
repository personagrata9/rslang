import { createElement } from '../../common/utils';
// import svgAudio from './audio';

class AudioChallenge {
  async render(): Promise<HTMLElement> {
    const audioChallengePage = createElement('div', ['audio-challenge-container']);
    audioChallengePage.append(this.createStructure());
    return audioChallengePage;
  }

  createStructure(): HTMLElement {
    const structurePage = createElement('div', ['audio-challenge-structure']);
    structurePage.append(this.createRulesPage());
    structurePage.append(this.createGamePage());
    return structurePage;
  }

  createRulesPage(): HTMLElement {
    const rulesPage = createElement('div', ['audio-rules-container']);
    rulesPage.append(createElement('h2', ['audio-rules-title'], 'Audio Challenge'));
    rulesPage.append(document.createElement('p'));
    return rulesPage;
  }

  createGamePage(): HTMLElement {
    const gamePage = createElement('div', ['audio-game-container']);
    return gamePage;
  }
}
export default AudioChallenge;
