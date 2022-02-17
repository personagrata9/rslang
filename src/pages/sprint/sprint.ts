import {
  createAnchorElement,
  createButtonElement,
  createElement,
  createInputElement,
  playAudio,
  random,
  shuffle,
} from '../../common/utils';
import ApiPage from '../api-page';
import { IWord } from '../../common/types';
import { BASE_URL, NUMBER_OF_PAGES } from '../../common/constants';
import svgAudio from '../audio-challenge/audio';

class Sprint extends ApiPage {
  private selectedUnit: string;

  private sprintGamePage: HTMLElement;

  private page: number | boolean;

  private gameWords: IWord[];

  private correctAnswers: IWord[];

  private wrongAnswers: IWord[];

  private wordContainer: HTMLElement;

  private pointsCount: number;

  private winstreak: number;

  private maxWinstreak: number;

  private pointsMultiplier: number;

  private borderMultiplier: number;

  private counter: number;

  private startTimer: NodeJS.Timer | null;

  private resultTimer: Promise<void> | null;

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
    this.wrongAnswers = [];
    this.startTimer = null;
    this.resultTimer = null;
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

  private createGame = async (group?: string): Promise<void> => {
    if (this.selectedUnit) {
      this.page = random(NUMBER_OF_PAGES);
      this.gameWords = await this.getWordsItems(this.selectedUnit, String(this.page));
    } else if (!this.page && group) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getWordsItems(group, String(this.page));
    }
    this.shuffleGameWords();
    this.sprintGamePage.innerHTML = '';
    const gamePage = createElement('div', ['container', 'sprint-game-container']);
    gamePage.append(this.createTimer(), this.createCheckboxes(), await this.createWordblock());
    this.sprintGamePage.append(gamePage);
    this.state.initGameState();
    await this.timer();
  };

  private createCheckboxes = (): HTMLElement => {
    const checkboxBlock = createElement('div', ['checkbox-block']);
    const firstCheckbox = createInputElement('checkbox', '', '', 'form-check-input', 'bonus-check');
    const secondCheckbox = createInputElement('checkbox', '', '', 'form-check-input', 'bonus-check');
    const thirdCheckbox = createInputElement('checkbox', '', '', 'form-check-input', 'bonus-check');
    checkboxBlock.append(firstCheckbox, secondCheckbox, thirdCheckbox);
    return checkboxBlock;
  };

  private createWordblock = async (): Promise<HTMLElement> => {
    this.keyboardControls();
    const generatedAnswer = await this.compareWords();
    if (generatedAnswer) {
      this.wordContainer.innerHTML = '';
      const currentResult = createElement('h2', ['word-container__title']);
      currentResult.textContent = `Current result is ${this.pointsCount}`;
      const pointsPerWord = createElement('p', []);
      pointsPerWord.textContent = `${this.pointsMultiplier}`;
      const wordBlock = createElement('div', ['word-block']);
      const englishWord = createElement('p', ['current-word']);
      const translatedWord = createElement('p', ['answer-word']);
      englishWord.innerHTML = `${generatedAnswer.currentWord.word}`;
      translatedWord.innerHTML = `${generatedAnswer.answer}`;
      const answerBtns = createElement('div', ['answer-btns']);
      const rightBtn = createButtonElement('button', 'correct', 'btn', 'btn-right');
      const wrongBtn = createButtonElement('button', 'wrong', 'btn', 'btn-wrong');
      rightBtn.onclick = async () => {
        // rightBtn.disabled = true;
        // wrongBtn.disabled = true;
        if (this.counter < this.gameWords.length - 1) {
          this.counter += 1;
          await this.checkAnswer(
            generatedAnswer.currentWord.wordTranslate === generatedAnswer.answer,
            generatedAnswer.currentWord
          );
        } else {
          this.counter = 0;
          const isWordsLoaded = await this.newWordsLoader();
          await this.checkAnswer(
            generatedAnswer.currentWord.wordTranslate === generatedAnswer.answer,
            generatedAnswer.currentWord
          ).then(async () => {
            if (!isWordsLoaded) await this.resultWindow();
            // console.log('right-btn-res');
          });
        }
      };
      wrongBtn.onclick = async () => {
        // rightBtn.disabled = true;
        // wrongBtn.disabled = true;

        if (this.counter < this.gameWords.length - 1) {
          this.counter += 1;
          await this.checkAnswer(
            generatedAnswer.currentWord.wordTranslate !== generatedAnswer.answer,
            generatedAnswer.currentWord
          );
        } else {
          this.counter = 0;
          const isWordsLoaded = await this.newWordsLoader();
          await this.checkAnswer(
            generatedAnswer.currentWord.wordTranslate !== generatedAnswer.answer,
            generatedAnswer.currentWord
          ).then(async () => {
            if (!isWordsLoaded) await this.resultWindow();
            // console.log('wrong-btn-res');
          });
        }
      };
      answerBtns.append(wrongBtn, rightBtn);
      wordBlock.append(englishWord, translatedWord, answerBtns);
      this.wordContainer.append(currentResult, pointsPerWord, wordBlock);
    }

    return this.wordContainer;
  };

  private checkAnswer = async (condition: boolean, currentWord: IWord): Promise<void> => {
    // eslint-disable-next-line no-underscore-dangle
    const wordId = currentWord.id || currentWord._id;
    if (wordId) {
      this.state.setGameWords(wordId);
      const bonusChecker = document.querySelectorAll('.bonus-check');
      if (condition) {
        this.pointsCount += this.pointsMultiplier;
        this.winstreak += 1;
        if (this.winstreak > this.maxWinstreak) {
          this.maxWinstreak = this.winstreak;
        }
        if (this.winstreak === this.borderMultiplier) {
          if (this.pointsMultiplier !== 80) {
            this.pointsMultiplier += 10;
          }
          this.borderMultiplier += 4;
        }
        if (this.winstreak % 4 === 1) {
          bonusChecker[0].setAttribute('checked', '');
        } else if (this.winstreak % 4 === 2) {
          bonusChecker[0].setAttribute('checked', '');
          bonusChecker[1].setAttribute('checked', '');
        } else if (this.winstreak % 4 === 3) {
          bonusChecker[0].setAttribute('checked', '');
          bonusChecker[1].setAttribute('checked', '');
          bonusChecker[2].setAttribute('checked', '');
        } else if (this.winstreak % 4 === 0) {
          bonusChecker[0].removeAttribute('checked');
          bonusChecker[1].removeAttribute('checked');
          bonusChecker[2].removeAttribute('checked');
        }
        this.correctAnswers.push(currentWord);
        this.state.setCorrectWords(wordId);
        // await playAudio(`../../static/audio/correct-answer.mp3`);
        await this.createWordblock();
      } else {
        // await playAudio(`../../static/audio/bad_answer.mp3`);
        this.winstreak = 0;
        this.pointsMultiplier = 10;
        this.borderMultiplier = 3;
        this.wrongAnswers.push(currentWord);
        this.state.setWrongWords(wordId);
        bonusChecker[0].removeAttribute('checked');
        bonusChecker[1].removeAttribute('checked');
        bonusChecker[2].removeAttribute('checked');
        await this.createWordblock();
      }
    }
  };

  private compareWords = async (): Promise<{ currentWord: IWord; answer: string } | undefined> => {
    const currentWord = this.gameWords[this.counter];
    if (!currentWord) {
      await this.resultWindow();
      // console.log('compare-res');
      return undefined;
    }

    const currentWordTranslate = currentWord.wordTranslate;

    if (this.gameWords.length === 1) {
      const answer = currentWordTranslate;
      return {
        currentWord,
        answer,
      };
    }
    const filteredWords = this.gameWords.filter((el) => el.word !== currentWord.word);
    const wrongAnswer = filteredWords[random(filteredWords.length)].wordTranslate;
    const answer = [currentWordTranslate, wrongAnswer][random(2)];
    return {
      currentWord,
      answer,
    };
  };

  private newWordsLoader = async (): Promise<boolean> => {
    let isWordsLoaded = false;
    if (typeof this.page === 'number' && this.page > 0) {
      isWordsLoaded = true;
      this.page -= 1;
      this.selectedUnit = this.selectedUnit || this.textbookGroup;
      this.gameWords = await this.getWordsItems(this.selectedUnit, this.page.toString());
      this.shuffleGameWords();
    }

    return isWordsLoaded;
  };

  private createTimer = (): HTMLElement => {
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
    return timerWrapper;
  };

  private createGameRules(): HTMLElement {
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

  private timer = async (): Promise<void> => {
    const tickTack = (): void => {
      const timer = <HTMLElement>document.querySelector('.timer');
      if (timer) {
        let secs = +timer.innerHTML;
        secs -= 1;
        timer.innerHTML = `${secs}`;
      }
    };

    this.startTimer = setInterval(tickTack, 1000);

    this.resultTimer = new Promise((resolve) => {
      const interval = setInterval(() => {
        // console.log('in-res-timer');
        const timer = <HTMLElement>document.querySelector('.timer');
        if (!timer) {
          // console.log('stop-res-timer-1');
          clearInterval(interval);
        }
        if (timer && +timer.innerHTML < 0) {
          // console.log('stop-res-timer-2');
          resolve(this.resultWindow());
          clearInterval(interval);
        }
      }, 1000);
    });
  };

  private shuffleGameWords = (): void => {
    const data: IWord[] = this.gameWords.slice();
    shuffle(data);
    this.gameWords = data;
  };

  private resultWindow = async (): Promise<void> => {
    clearInterval(<NodeJS.Timeout>this.startTimer);
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
    this.state.setMaxWinstreak(this.maxWinstreak);
    const rightAnswerCount = createElement('span', ['right-answer-count']);
    const wrongAnswerCount = createElement('span', ['wrong-answer-count']);
    const correctAnswerBlock = createElement('div', ['correct-answer-block']);
    const inCorrectAnswerBlock = createElement('div', ['correct-answer-block']);
    rightAnswerCount.innerHTML = `Right answers: <span>${this.correctAnswers.length}</span>`;
    wrongAnswerCount.innerHTML = `Wrong answers: <span>${this.wrongAnswers.length}</span>`;
    correctAnswerBlock.append(rightAnswerCount);
    inCorrectAnswerBlock.append(wrongAnswerCount);
    this.correctAnswers.forEach((e) => {
      correctAnswerBlock.append(this.addBoxResults(e));
    });
    this.wrongAnswers.forEach((e) => {
      inCorrectAnswerBlock.append(this.addBoxResults(e));
    });
    const footerBtns = createElement('div', ['footer-btns']);
    const rulesBtn = createButtonElement('button', 'to start', 'btn', 'to-rules-btn');
    const textbookBtn = createAnchorElement('#textbook', 'to textbook', 'btn', 'to-textbook-btn');
    footerBtns.append(rulesBtn, textbookBtn);
    rulesBtn.onclick = () => this.render();
    wordsBlock.append(correctAnswerBlock, inCorrectAnswerBlock);
    resultWrapper.append(resultHeader, blockWrapper, footerBtns);
    this.sprintGamePage.append(resultWrapper);
    localStorage.removeItem('isTextbook');

    await this.state.updateGameState();

    this.restoreValues();
    // console.log('result');
  };

  private createResultCircle = (): HTMLElement => {
    const circleWrapper = createElement('div', ['circle-wrapper']);
    const circleContainer = createElement('div', ['circle-container']);
    const circleBody = createElement('div', ['circle-body']);
    const circleCounter = createElement('div', ['circle-counter']);
    const bestStreak = createElement('span', []);
    const winrate = createElement('span', []);
    const winrateNum =
      Math.ceil((this.correctAnswers.length / (this.wrongAnswers.length + this.correctAnswers.length)) * 100) || 0;
    const root = <HTMLElement>document.querySelector(':root');
    root.style.setProperty('--height', `${winrateNum}%`);
    winrate.innerHTML = `Winrate: ${winrateNum}%`;
    bestStreak.innerHTML = `Best winstreak: ${this.maxWinstreak}`;
    circleCounter.append(bestStreak, winrate);
    circleBody.append(circleCounter);
    circleContainer.append(circleBody);
    circleWrapper.append(circleContainer);
    return circleWrapper;
  };

  private addBoxResults = (word: IWord): HTMLElement => {
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

  private resultToggle = (): void => {
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

  private restoreValues = (): void => {
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.winstreak = 0;
    this.pointsMultiplier = 0;
    this.maxWinstreak = 0;
    this.pointsCount = 0;
    this.counter = 0;
    this.selectedUnit = '';
  };

  keyboardControls = () => {
    const event = new KeyboardEvent('click');
    if (!document.querySelector('.result-wrapper')) {
      window.addEventListener(
        'keydown',
        (e) => {
          const evCode = e.code;
          switch (evCode) {
            case 'KeyZ':
              if (<HTMLButtonElement>document.querySelector('.btn-wrong')) {
                (<HTMLButtonElement>document.querySelector('.btn-wrong')).dispatchEvent(event);
              }

              break;
            case 'KeyX':
              if (<HTMLButtonElement>document.querySelector('.btn-right')) {
                (<HTMLButtonElement>document.querySelector('.btn-right')).dispatchEvent(event);
              }
              break;
            default:
              break;
          }
        },
        { once: true }
      );
    }
  };
}

export default Sprint;
