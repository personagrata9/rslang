import { createElement, createSelect } from '../../common/utils';
// import svgAudio from './audio';
import ApiPage from '../api-page';

class AudioChallenge extends ApiPage {
  constructor() {
    super('audio-challenge');
  }

  async render(): Promise<void> {
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    const audioChallengePage = createElement('div', ['audio-challenge-container']);
    audioChallengePage.append(this.createStructure());
    contentContainer.append(audioChallengePage);
  }

  createStructure(): HTMLElement {
    const structurePage = createElement('div', ['audio-challenge-structure']);
    structurePage.append(this.createRulesPage());
    return structurePage;
  }

  createGamePage(): void {
    const structurePage = document.querySelector('.audio-challenge-structure');
    if (structurePage) {
      structurePage.innerHTML = '';
    }
    const gamePage = createElement('div', ['audio-game-container']);
    gamePage.innerHTML = `<div class="box-audio-button"><img class="repeat-aydio-button" src="https://www.svgrepo.com/show/210514/music-player-audio.svg"></div>`;
    structurePage?.append(gamePage);
  }

  createRulesPage(): HTMLElement {
    const listClass = 'list-rules-item';
    const rulesPage = createElement('div', ['audio-rules-container']);
    rulesPage.append(createElement('div', ['audio-rules-container-back']));
    const frontContainer = createElement('div', ['audio-rules-container-front']);
    frontContainer.append(createElement('h2', ['audio-rules-title'], 'Audio Challenge'));
    frontContainer.append(
      createElement('p', ['audio-rules-text'], `"Audio Challenge" is a workout that improves listening comprehension.`)
    );
    const ulRules = createElement('ul', ['list-rules']);
    ulRules.append(createElement('li', [listClass], 'Use the mouse to select.'));
    ulRules.append(createElement('li', [listClass], 'Use number keys from 1 to 5 to select an answer'));
    ulRules.append(createElement('li', [listClass], 'Use the mouse to select.'));
    ulRules.append(createElement('li', [listClass], `Use a "space" to repeat a word`));
    ulRules.append(createElement('li', [listClass], `Use the "Enter" key for a hint or to move to the next word`));
    frontContainer.append(ulRules);
    const controlBoxAudio = createElement('div', ['control-box-audio-page']);
    const selectLevel = createSelect(['1', '2', '3', '4', '5', '6']);
    controlBoxAudio.append(selectLevel);
    const buttonChoiseLevel = createElement(
      'button',
      ['choise-audio-level-button', 'btn', 'btn-outline-light'],
      'Start'
    );
    buttonChoiseLevel.addEventListener('click', () => this.createGamePage());
    controlBoxAudio.append(buttonChoiseLevel);
    frontContainer.append(controlBoxAudio);
    rulesPage.append(frontContainer);
    return rulesPage;
  }
}
export default AudioChallenge;
