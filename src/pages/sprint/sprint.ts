import { createButtonElement, createElement, createInputElement, playAudio, random } from '../../common/utils';
import ApiPage from '../api-page';
import { IWord } from '../../common/types';
import { NUMBER_OF_PAGES, WORDS_PER_PAGE } from '../../common/constants';
import sprintStatistics from './gameStatistic';

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

  private winstreak: number;

  private maxWinstreak: number;

  private pointsMultiplier: number;

  private borderMultiplier: number;

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
    this.pointsMultiplier = 10;
    this.borderMultiplier = 3;
    this.winstreak = 0;
    this.maxWinstreak = 0;
    this.gameWords = [];
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
  }

  async render(): Promise<void> {
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
    this.winstreak = 0;
    this.pointsCount = 0;
    this.sprintGamePage.innerHTML = '';
    this.sprintGamePage.append(this.createGameRules());
    this.contentContainer.append(this.sprintGamePage);
  }

  createGame = async (state?: string): Promise<void> => {
    if (this.gameWords.length === 0 && !this.page && state) {
      this.page = random(NUMBER_OF_PAGES);
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
    const currentResult = createElement('h2', ['word-container__title']);
    currentResult.textContent = `Current result is ${this.pointsCount}`;
    const pointsPerWord = createElement('p', []);
    const checkboxBlock = createElement('div', []);
    const firstCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const secondCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    const thirdCheckbox = createInputElement('checkbox', '', '', 'form-check-input');
    checkboxBlock.append(firstCheckbox, secondCheckbox, thirdCheckbox);
    pointsPerWord.textContent = `${this.pointsMultiplier}`;
    const generatedAnswer = this.compareWords();
    const wordBlock = createElement('div', ['word-block']);
    const englishWord = createElement('p', ['current-word']);
    const translatedWord = createElement('p', ['answer-word']);
    englishWord.innerHTML = `${generatedAnswer.currentWordEng}`;
    translatedWord.innerHTML = `${generatedAnswer.answer}`;
    const answerBtns = createElement('div', ['answer-btns']);
    const rightBtn = createButtonElement('button', 'right', 'btn', 'btn-right');
    const wrongBtn = createButtonElement('button', 'wrong', 'btn', 'btn-wrong');
    rightBtn.onclick = async () => {
      if (generatedAnswer.currentWordTranslate === generatedAnswer.answer) {
        this.pointsCount += this.pointsMultiplier;
        this.winstreak += 1;
        if (this.winstreak > this.maxWinstreak) {
          this.maxWinstreak = this.winstreak;
        }
        if (this.winstreak === this.borderMultiplier) {
          this.pointsMultiplier += 10;
          this.borderMultiplier += 3;
        }
        this.correctAnswers.push(1);
        sprintStatistics.correct.set(generatedAnswer.currentWord.id, 1);
        await playAudio(`../../static/audio/correct-answer.mp3`);
        await this.createWordblock();
      } else {
        await playAudio(`../../static/audio/bad_answer.mp3`);
        sprintStatistics.wrong.set(generatedAnswer.currentWord.id, 1);
        this.winstreak = 0;
        this.pointsMultiplier = 10;
        this.borderMultiplier = 3;
        this.inCorrectAnswers.push(1);
        await this.createWordblock();
      }
    };
    wrongBtn.onclick = async () => {
      if (generatedAnswer.currentWordTranslate !== generatedAnswer.answer) {
        this.pointsCount += this.pointsMultiplier;
        this.winstreak += 1;
        if (this.winstreak > this.maxWinstreak) {
          this.maxWinstreak = this.winstreak;
        }
        if (this.winstreak === this.borderMultiplier) {
          this.pointsMultiplier += 10;
          this.borderMultiplier += 3;
        }
        this.correctAnswers.push(1);
        sprintStatistics.correct.set(generatedAnswer.currentWord.id, 1);
        await playAudio(`../../static/audio/correct-answer.mp3`);
        await this.createWordblock();
      } else {
        await playAudio(`../../static/audio/bad_answer.mp3`);
        sprintStatistics.wrong.set(generatedAnswer.currentWord.id, 1);
        this.winstreak = 0;
        this.pointsMultiplier = 10;
        this.borderMultiplier = 3;
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
    const currentWord = this.gameWords[random(WORDS_PER_PAGE)];
    const currentWordEng = currentWord.word;
    const currentWordTranslate = currentWord.wordTranslate;
    const filteredWords = this.gameWords.filter((el) => el.word !== currentWord.word);
    const wrongAnswer = filteredWords[random(WORDS_PER_PAGE - 1)].wordTranslate;
    const answer = [currentWordTranslate, wrongAnswer][random(2)];
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
    const functionsUl = createElement(
      'ul',
      ['sprint__ul-title'],
      `"Sprint" is a practice for repeating memorized words from your vocabulary.`
    );
    const mouseLi = createElement('li', [], 'use the mouse to select.');
    const keysLi = createElement('li', [], 'use the left or right keys.');
    functionsUl.append(mouseLi, keysLi);
    const btnWrapper = createElement('div', ['rules__btn-wrapper']);
    const unitBtnGroup = createElement('div', ['btn-group']);
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
    unitBtnGroup.append(firstBtn, secondBtn, thirdBtn, fourthBtn, fifthBtn, sixthBtn);
    btnWrapper.append(unitBtnGroup, startBtn);
    rulesContainer.append(functionsUl, btnWrapper);
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
    }, 6000);
  };

  resultWindow = (): void => {
    this.sprintGamePage.innerHTML = '';
    const resultWrapper = createElement('div', ['container', 'result-wrapper']);
    const resultHeader = createElement('div', ['result-header']);
    const resultBtn = createButtonElement('button', 'Results', 'btn', 'result-btn');
    const wordsBtn = createButtonElement('button', 'Words', 'btn', 'words-btn');
    resultHeader.append(resultBtn, wordsBtn);
    const blockWrapper = createElement('div', ['block-wrapper']);
    const resultBlock = createElement('div', ['result-block']);
    const wordsBlock = createElement('div', ['words-block']);
    blockWrapper.append(resultBlock, wordsBlock);
    const bestStreak = createElement('span', []);
    const winrate = createElement('span', []);
    winrate.innerHTML = `Winrate: ${this.inCorrectAnswers.length / this.correctAnswers.length || 0}`;
    bestStreak.innerHTML = `Best winstreak: ${this.maxWinstreak}`;
    sprintStatistics.bestSeries = this.maxWinstreak;
    const rightAnswerCount = createElement('span', []);
    const wrongAnswerCount = createElement('span', []);
    rightAnswerCount.innerHTML = `Right answers: ${this.correctAnswers.length}`;
    wrongAnswerCount.innerHTML = `Wrong answers: ${this.inCorrectAnswers.length}`;
    const rulesBtn = createButtonElement('button', 'to start', 'btn', 'to-rules-btn');
    rulesBtn.onclick = () => this.render();
    resultBlock.append(bestStreak, winrate);
    wordsBlock.append(rightAnswerCount, wrongAnswerCount);
    resultWrapper.append(resultHeader, blockWrapper, rulesBtn);
    this.sprintGamePage.append(resultWrapper);
  };
}

export default Sprint;
