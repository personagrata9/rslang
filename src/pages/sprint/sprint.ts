import { createButtonElement, createElement, createInputElement, randomizer } from '../../common/utils';
import ApiPage from '../api-page';
import { IWord } from '../../common/types';
import { NUMBER_OF_PAGES, WORDS_PER_PAGE } from '../../common/constants';

class Sprint extends ApiPage {
  private selectedUnit: string;

  private sprintGamePage: HTMLElement;

  private currentWordRus: string;

  private currentIndexWord: number;

  private currentWordEn: string;

  private page: number | boolean;

  private gameWords: IWord[];

  private correctAnswers: number[];

  private inCorrectAnswers: number[];

  private wordContainer: HTMLElement;

  private pointsCount: number;

  constructor() {
    super('sprint');
    this.sprintGamePage = createElement('div', ['sprint-container']);
    this.wordContainer = createElement('div', ['container-sm', 'word-container']);
    this.selectedUnit = '';
    this.currentIndexWord = 0;
    this.currentWordRus = '';
    this.currentWordEn = '';
    this.pointsCount = 0;
    this.page = false;
    this.gameWords = [];
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
  }

  async render(): Promise<void> {
    this.sprintGamePage.append(this.createGameRules());
    this.contentContainer.append(this.sprintGamePage);
  }

  createGame = async (state?: string): Promise<void> => {
    if (this.gameWords.length === 0 && !this.page && state) {
      this.page = randomizer(NUMBER_OF_PAGES);
      this.gameWords = await this.getWordsItems(state, String(this.page));
    } else if (this.gameWords.length === 0 && !this.page && !state) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getWordsItems(this.textbookGroup, String(this.page));
    }
    this.sprintGamePage.innerHTML = '';
    const gamePage = createElement('div', ['container', 'sprint-game-container']);
    gamePage.append(this.createTimer(), await this.createWordblock());
    this.sprintGamePage.append(gamePage);
  };

  createWordblock = async () => {
    this.wordContainer.innerHTML = '';
    const currentResult = createElement('h2', []);
    currentResult.textContent = `Current result is ${this.pointsCount}`;
    const pointsPerWord = createElement('p', []);
    const checkboxBlock = createElement('div', []);
    const firstCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const secondCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const thirdCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    checkboxBlock.append(firstCheckbox, secondCheckbox, thirdCheckbox);
    pointsPerWord.textContent = '+10';
    const generatedAnswer = this.compareWords();
    const wordBlock = createElement('div', []);
    const englishWord = createElement('p', []);
    const translatedWord = createElement('p', []);
    englishWord.innerHTML = `${generatedAnswer.currentWordEng}`;
    translatedWord.innerHTML = `${generatedAnswer.answer}`;
    const answerBtns = createElement('div', []);
    const rightBtn = createButtonElement('button', 'Right', 'btn');
    const wrongBtn = createButtonElement('button', 'Wrong', 'btn');
    rightBtn.onclick = async () => {
      if (generatedAnswer.currentWordTranslate === generatedAnswer.answer) {
        this.pointsCount += 10;
        this.correctAnswers.push(1);
        await this.createWordblock();
      } else {
        this.inCorrectAnswers.push(1);
        await this.createWordblock();
      }
    };
    wrongBtn.onclick = async () => {
      if (generatedAnswer.currentWordTranslate !== generatedAnswer.answer) {
        this.pointsCount += 10;
        this.correctAnswers.push(1);
        await this.createWordblock();
      } else {
        this.inCorrectAnswers.push(1);
        await this.createWordblock();
      }
    };
    answerBtns.append(rightBtn, wrongBtn);
    wordBlock.append(englishWord, translatedWord, answerBtns);
    this.wordContainer.append(currentResult, pointsPerWord, checkboxBlock, wordBlock);
    return this.wordContainer;
  };

  compareWords = () => {
    const currentWord = this.gameWords[randomizer(WORDS_PER_PAGE)];
    const currentWordEng = currentWord.word;
    const currentWordTranslate = currentWord.wordTranslate;
    const filteredWords = this.gameWords.filter((el) => el.word !== currentWord.word);
    const wrongAnswer = filteredWords[randomizer(WORDS_PER_PAGE - 1)].wordTranslate;
    const answer = [currentWordTranslate, wrongAnswer][randomizer(2)];
    return {
      currentWord,
      currentWordEng,
      currentWordTranslate,
      answer,
    };
  };

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
    const startBtn = createButtonElement('button', 'Start', 'btn', 'btn-start', 'disabled');
    [firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn].forEach((e) =>
      e.addEventListener('click', () => {
        startBtn.classList.remove('disabled');
        this.selectedUnit = String(Number(e.textContent) - 1);
      })
    );
    startBtn.onclick = async () => {
      await this.createGame(this.selectedUnit);
    };
    selectGroup.append(firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn);
    rulesContainer.append(sprintTitle, sprintParagraph, functionsUl, selectGroup, startBtn);
    return rulesContainer;
  }

  timer = (): void => {
    function tickTack() {
      const timer = <HTMLElement>document.querySelector('.timer');
      let secs = +timer.innerHTML;
      secs -= 1;
      timer.innerHTML = `${secs}`;
    }
    const startTimer = setInterval(tickTack, 1000);
    setTimeout(() => {
      clearInterval(startTimer);
      this.resultWindow();
    }, 60000);
  };

  resultWindow = (): void => {
    this.sprintGamePage.innerHTML = '';
    const resultWrapper = createElement('div', ['container', 'result-wrapper']);
    const resultHeader = createElement('div', ['result-header']);
    const resultBtn = createButtonElement('button', 'Results', 'btn', 'result-btn');
    const wordsBtn = createButtonElement('button', 'Results', 'btn', 'result-btn');
    resultHeader.append(resultBtn, wordsBtn);
    const resultTitle = createElement('h2', ['result-title'], 'Results');
    resultWrapper.append(resultTitle);
    this.sprintGamePage.append(resultWrapper);
  };
}

export default Sprint;
