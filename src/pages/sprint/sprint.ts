import { createButtonElement, createElement, createInputElement, playAudio, random, shuffle } from '../../common/utils';
import ApiPage from '../api-page';
import { IWord } from '../../common/types';
import { BASE_URL, NUMBER_OF_PAGES, WORDS_PER_PAGE } from '../../common/constants';
import sprintStatistics from './gameStatistic';
import svgAudio from '../audio-challenge/audio';

class Sprint extends ApiPage {
  private selectedUnit: string;

  private sprintGamePage: HTMLElement;

  private page: number | boolean;

  private gameWords: IWord[];

  private correctAnswers: IWord[];

  private inCorrectAnswers: IWord[];

  private wordContainer: HTMLElement;

  private pointsCount: number;

  private winstreak: number;

  private maxWinstreak: number;

  private pointsMultiplier: number;

  private borderMultiplier: number;

  private counter: number;

  constructor() {
    super('sprint');
    this.sprintGamePage = createElement('div', ['sprint-container']);
    this.wordContainer = createElement('div', ['container-md', 'word-container']);
    this.selectedUnit = '';
    this.pointsCount = 0;
    this.page = false;
    this.pointsMultiplier = 10;
    this.borderMultiplier = 3;
    this.winstreak = 0;
    this.maxWinstreak = 0;
    this.counter = 0;
    this.gameWords = [];
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
  }

  async render(): Promise<void> {
    this.sprintGamePage.innerHTML = '';
    const state = localStorage.getItem('isTextbook');
    if (state) {
      await this.createGame(this.textbookGroup);
    } else {
      this.sprintGamePage.append(this.createGameRules());
    }
    this.contentContainer.append(this.sprintGamePage);
  }

  createGame = async (group?: string): Promise<void> => {
    if (this.gameWords.length === 0 && !this.page && group) {
      this.page = random(NUMBER_OF_PAGES);
      this.gameWords = await this.getWordsItems(group, String(this.page));
    } else if (this.gameWords.length === 0 && !this.page && !group) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getWordsItems(this.textbookGroup, String(this.page));
    }
    this.shuffleGameWords();
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
    const generatedAnswer = await this.compareWords();
    const wordBlock = createElement('div', ['word-block']);
    const englishWord = createElement('p', ['current-word']);
    const translatedWord = createElement('p', ['answer-word']);
    englishWord.innerHTML = `${generatedAnswer.currentWord.word}`;
    translatedWord.innerHTML = `${generatedAnswer.answer}`;
    const answerBtns = createElement('div', ['answer-btns']);
    const rightBtn = createButtonElement('button', 'right', 'btn', 'btn-right');
    const wrongBtn = createButtonElement('button', 'wrong', 'btn', 'btn-wrong');
    rightBtn.onclick = async () => {
      await this.checkAnswer(
        generatedAnswer.currentWord.wordTranslate === generatedAnswer.answer,
        generatedAnswer.currentWord
      );
    };
    wrongBtn.onclick = async () => {
      await this.checkAnswer(
        generatedAnswer.currentWord.wordTranslate !== generatedAnswer.answer,
        generatedAnswer.currentWord
      );
    };
    answerBtns.append(rightBtn, wrongBtn);
    wordBlock.append(englishWord, translatedWord, answerBtns);
    this.wordContainer.append(currentResult, pointsPerWord, checkboxBlock, wordBlock);
    return this.wordContainer;
  };

  private checkAnswer = async (condition: boolean, currentWord: IWord): Promise<void> => {
    sprintStatistics.newWords.add(currentWord.id);
    if (condition) {
      this.pointsCount += this.pointsMultiplier;
      this.winstreak += 1;
      if (this.winstreak > this.maxWinstreak) {
        this.maxWinstreak = this.winstreak;
      }
      if (this.winstreak === this.borderMultiplier) {
        this.pointsMultiplier += 10;
        this.borderMultiplier += 3;
      }
      this.correctAnswers.push(currentWord);
      if (sprintStatistics.correct.has(currentWord.id)) {
        const value = <number>sprintStatistics.correct.get(currentWord.id);
        sprintStatistics.correct.set(currentWord.id, value + 1);
      } else {
        sprintStatistics.correct.set(currentWord.id, 1);
      }
      await playAudio(`../../static/audio/correct-answer.mp3`);
      await this.createWordblock();
    } else {
      await playAudio(`../../static/audio/bad_answer.mp3`);
      this.winstreak = 0;
      this.pointsMultiplier = 10;
      this.borderMultiplier = 3;
      this.inCorrectAnswers.push(currentWord);
      if (sprintStatistics.wrong.has(currentWord.id)) {
        const value = <number>sprintStatistics.wrong.get(currentWord.id);
        sprintStatistics.wrong.set(currentWord.id, value + 1);
      } else {
        sprintStatistics.wrong.set(currentWord.id, 1);
      }
      await this.createWordblock();
    }
  };

  compareWords = async () => {
    const currentWord = this.gameWords[this.counter];
    const currentWordTranslate = currentWord.wordTranslate;
    const filteredWords = this.gameWords.filter((el) => el.word !== currentWord.word);
    const wrongAnswer = filteredWords[random(WORDS_PER_PAGE - 1)].wordTranslate;
    const answer = [currentWordTranslate, wrongAnswer][random(2)];
    this.counter += 1;
    // console.log(this.counter);
    await this.newWordsLoader();
    return {
      currentWord,
      answer,
    };
  };

  newWordsLoader = async () => {
    if (this.counter === this.gameWords.length - 1) {
      this.page = +this.page - 1;
      this.gameWords = await this.getWordsItems(this.selectedUnit, String(this.page));
      this.shuffleGameWords();
      this.counter = 0;
    }
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
    }, 60000);
  };

  shuffleGameWords = () => {
    const data: IWord[] = this.gameWords.slice();
    shuffle(data);
    this.gameWords = data;
  };

  resultWindow = (): void => {
    this.sprintGamePage.innerHTML = '';
    const resultWrapper = createElement('div', ['container', 'result-wrapper']);
    const resultHeader = createElement('div', ['result-header']);
    const switchBlock = createInputElement('checkbox', 'switch', '', 'switch-block');
    const switchBlockLabel = createElement('label', ['switch-block-label']);
    switchBlockLabel.innerHTML = `Results Words`;
    switchBlockLabel.setAttribute('for', 'switch');
    switchBlockLabel.onclick = this.resultToggle;
    resultHeader.append(switchBlock, switchBlockLabel);
    const blockWrapper = createElement('div', ['block-wrapper']);
    const resultBlock = createElement('div', ['result-block']);
    const wordsBlock = createElement('div', ['words-block', 'hide']);
    blockWrapper.append(resultBlock, wordsBlock);
    resultBlock.append(this.createResultCircle());
    if (sprintStatistics.bestSeries < this.maxWinstreak) {
      sprintStatistics.bestSeries = this.maxWinstreak;
    }
    const rightAnswerCount = createElement('span', ['right-answer-count']);
    const wrongAnswerCount = createElement('span', ['wrong-answer-count']);
    const correctAnswerBlock = createElement('div', ['correct-answer-block']);
    const inCorrectAnswerBlock = createElement('div', ['correct-answer-block']);
    rightAnswerCount.innerHTML = `Right answers: <span>${this.correctAnswers.length}</span>`;
    wrongAnswerCount.innerHTML = `Wrong answers: <span>${this.inCorrectAnswers.length}</span>`;
    correctAnswerBlock.append(rightAnswerCount);
    inCorrectAnswerBlock.append(wrongAnswerCount);
    this.correctAnswers.forEach((e) => {
      correctAnswerBlock.append(this.addBoxResults(e));
    });
    this.inCorrectAnswers.forEach((e) => {
      inCorrectAnswerBlock.append(this.addBoxResults(e));
    });
    const rulesBtn = createButtonElement('button', 'to start', 'btn', 'to-rules-btn');
    rulesBtn.onclick = () => this.render();
    wordsBlock.append(correctAnswerBlock, inCorrectAnswerBlock);
    resultWrapper.append(resultHeader, blockWrapper, rulesBtn);
    this.sprintGamePage.append(resultWrapper);
    localStorage.removeItem('isTextbook');
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
    this.winstreak = 0;
    this.maxWinstreak = 0;
    this.pointsCount = 0;
    this.counter = 0;
  };

  createResultCircle = (): HTMLElement => {
    const circleWrapper = createElement('div', ['circle-wrapper']);
    const circleContainer = createElement('div', ['circle-container']);
    const circleBody = createElement('div', ['circle-body']);
    const circleCounter = createElement('div', ['circle-counter']);
    const bestStreak = createElement('span', []);
    const winrate = createElement('span', []);
    winrate.innerHTML = `Winrate: ${Math.ceil(this.inCorrectAnswers.length / this.correctAnswers.length) * 10 || 0}%`;
    bestStreak.innerHTML = `Best winstreak: ${this.maxWinstreak}`;
    circleCounter.append(bestStreak, winrate);
    circleBody.append(circleCounter);
    circleContainer.append(circleBody);
    circleWrapper.append(circleContainer);
    return circleWrapper;
  };

  addBoxResults = (word: IWord) => {
    const boxWordInfo = createElement('div', ['box-word-info']);
    const repeatButton = createElement('button', ['popup-button-repeat']);
    repeatButton.innerHTML = svgAudio;
    const fullAudioLink = `${BASE_URL}/${word.audio}`;
    repeatButton.onclick = () => playAudio(fullAudioLink);
    boxWordInfo.append(repeatButton);
    const wordEn = createElement('span', ['popup-english-word']);
    wordEn.innerHTML = `&#160 ${word.word} &#160`;
    const wordRu = createElement('span', ['popup-russian-word']);
    wordRu.innerHTML = `— &#160 ${word.wordTranslate}`;
    boxWordInfo.append(wordEn);
    boxWordInfo.append(wordRu);
    return boxWordInfo;
  };

  resultToggle = () => {
    const resultBlock = <HTMLElement>document.querySelector('.result-block');
    const wordsBlock = <HTMLElement>document.querySelector('.words-block');
    if (resultBlock.classList.contains('hide')) {
      resultBlock.classList.remove('hide');
      resultBlock.classList.add('visible');
      wordsBlock.classList.remove('visible');
      wordsBlock.classList.add('hide');
    } else {
      wordsBlock.classList.remove('hide');
      wordsBlock.classList.add('visible');
      resultBlock.classList.remove('visible');
      resultBlock.classList.add('hide');
    }
  };
}

export default Sprint;
