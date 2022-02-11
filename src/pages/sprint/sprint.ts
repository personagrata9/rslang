import { createButtonElement, createElement, createInputElement } from '../../common/utils';
import ApiPage from '../api-page';
import Api from '../../api/api';
import { IWord } from '../../common/types';

class Sprint extends ApiPage {
  private selectedUnit: string;

  private sprintGamePage: HTMLElement;

  constructor() {
    super('sprint');
    this.sprintGamePage = createElement('div', ['sprint-container']);
    this.selectedUnit = '1';
  }

  async render(): Promise<void> {
    this.sprintGamePage.append(this.createGameRules());
    this.contentContainer.append(this.sprintGamePage);
  }

  createGame(unit: string): void {
    this.sprintGamePage.innerHTML = '';

    const gamePage = createElement('div', ['container', 'sprint-game-container']);
    const api = new Api();
    const currentResult = createElement('h2', []);
    currentResult.textContent = 'Current result is';
    const wordContainer = createElement('div', ['container-sm', 'word-container']);
    const answerBtns = createElement('div', []);
    const rightBtn = createButtonElement('button', 'Right', 'btn');
    const wrongBtn = createButtonElement('button', 'Wrong', 'btn');
    answerBtns.append(rightBtn, wrongBtn);
    const pointsPerWord = createElement('p', []);
    const checkboxBlock = createElement('div', []);
    const firstCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const secondCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const thirdCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    checkboxBlock.append(firstCheckbox, secondCheckbox, thirdCheckbox);
    const englishWord = createElement('p', []);
    const translatedWord = createElement('p', []);
    pointsPerWord.textContent = '+10';
    wordContainer.append(currentResult, checkboxBlock, englishWord, translatedWord, answerBtns);
    gamePage.append(this.createTimer(), wordContainer);
    // eslint-disable-next-line no-void
    void this.game(api.getWords(unit, this.randomizer().toString()));
    this.sprintGamePage.append(gamePage);
  }

  createTimer = (): HTMLElement => {
    const timerWrapper = createElement('div', ['timer-wrapper']);
    const timerContainer = createElement('div', ['timer-container']);
    const timerLine = createElement('div', ['timer-line']);
    const timerBody = createElement('div', ['timer-body']);
    const timerCounter = createElement('div', ['timer-counter']);
    const timer = createElement('span', ['timer'], '60');
    timerCounter.append(timer);
    timerBody.append(timerCounter);
    timerContainer.append(timerLine, timerBody);
    timerWrapper.append(timerContainer);
    this.timer();
    return timerWrapper;
  };

  createGameRules(): HTMLElement {
    const rulesContainer = createElement('div', ['container', 'sprint-rules-container']);
    const sprintTitle = createElement('h2', [], 'Sprint');
    const sprintParagraph = createElement(
      'p',
      [],
      '"Sprint" is a practice for repeating memorized words from your vocabulary.'
    );
    const functionsUl = createElement('ul', []);
    const mouseLi = createElement('li', [], 'use the mouse to select.');
    const keysLi = createElement('li', [], 'use the left or right keys.');
    functionsUl.append(mouseLi, keysLi);
    const selectGroup = createElement('div', ['btn-group']);
    const firstBtn = createButtonElement('button', '1', 'firstUnit', 'btn');
    const secondBtn = createButtonElement('button', '2', 'secondUnit', 'btn');
    const thirdBtn = createButtonElement('button', '3', 'thirdUnit', 'btn');
    const fourthBtn = createButtonElement('button', '4', 'fourthUnit', 'btn');
    const fifthBtn = createButtonElement('button', '5', 'fifthUnit', 'btn');
    const sixthBtn = createButtonElement('button', '6', 'sixthUnit', 'btn');
    [firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn].forEach((e) =>
      e.addEventListener('click', () => {
        this.selectedUnit = <string>e.textContent;
      })
    );
    const startBtn = createButtonElement('button', 'Start', 'btn', 'btn-start');
    startBtn.addEventListener('click', () => this.createGame(this.selectedUnit));
    selectGroup.append(firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn);
    rulesContainer.append(sprintTitle, sprintParagraph, functionsUl, selectGroup, startBtn);
    return rulesContainer;
  }

  randomizer = (): number => {
    const randomNum = Math.floor(Math.random() * 30);
    return randomNum;
  };

  game = async (data: Promise<IWord[]>) => {
    await data.then((words) => {
      words.forEach((el) => console.log(el.wordTranslate));
    });
  };

  timer = () => {
    function tickTack() {
      const timer = <HTMLElement>document.querySelector('.timer');
      let secs = +timer.innerHTML;
      secs -= 1;
      timer.innerHTML = `${secs}`;
      if (secs === 0) {
        console.log('end');
      }
    }
    const startTimer = setInterval(tickTack, 1000);
    setTimeout(() => clearInterval(startTimer), 60000);
  };
}

export default Sprint;
