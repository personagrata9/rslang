import Api from '../../api/api';
import { BASE_URL } from '../../common/constants';
import { Colors, DifficultyType, INewUserWordData, IWord } from '../../common/types';
import { createElement, createButtonElement } from '../../common/utils';

class WordCard {
  private name: string;

  private container: HTMLElement;

  private api: Api;

  private userId: string | null;

  constructor(
    private word: IWord,
    private color: string,
    private Difficulty: DifficultyType | undefined,
    private isLearned: boolean | undefined
  ) {
    this.name = 'word-card';
    this.container = createElement('div', ['container', `${this.name}-container`, 'd-flex', 'shadow', 'rounded-3']);
    this.word = word;
    this.color = color;
    this.Difficulty = Difficulty;
    this.isLearned = isLearned;
    this.api = new Api();
    this.userId = localStorage.getItem('UserId');
  }

  private createImage = (): HTMLElement => {
    const imageContainer: HTMLElement = createElement('div', [`${this.name}-image`]);

    const image: HTMLImageElement = new Image();
    image.src = `${BASE_URL}/${this.word.image}`;
    image.onload = () => {
      imageContainer.style.backgroundImage = `url(${image.src})`;
    };

    return imageContainer;
  };

  private createMarkerElement = (): HTMLElement => {
    const markerElement: HTMLElement = createElement('div', [`${this.name}-marker`]);
    markerElement.style.backgroundColor = this.Difficulty === 'hard' ? Colors.Orange : this.color;

    return markerElement;
  };

  private createWordElement = (): HTMLElement => {
    const wordElement: HTMLElement = createElement('div', [`${this.name}-item`, 'd-flex', 'flex-wrap', 'mb-3']);

    const word: HTMLElement = createElement('h3', [`${this.name}-word`, 'text-capitalize'], this.word.word);
    const transcription: HTMLElement = createElement(
      'p',
      [`${this.name}-transcription`, 'ms-3', 'mb-0', 'pt-1'],
      this.word.transcription
    );
    const wordTranslate: HTMLElement = createElement(
      'p',
      [`${this.name}-translate`, 'm-0', 'w-100'],
      this.word.wordTranslate.toLowerCase()
    );

    wordElement.append(word, transcription, wordTranslate);

    return wordElement;
  };

  private createTextMeaningElement = (): HTMLElement => {
    const textMeaningElement: HTMLElement = createElement('div', [`${this.name}-text-meaning-item`, 'mb-3']);

    const textMeaning: HTMLElement = createElement('p', [`${this.name}-text-meaning`, 'm-0']);
    textMeaning.innerHTML = this.word.textMeaning;
    const textMeaningTranslate: HTMLElement = createElement(
      'p',
      [`${this.name}-text-meaning-translate`, 'm-0'],
      this.word.textMeaningTranslate
    );

    textMeaningElement.append(textMeaning, textMeaningTranslate);

    return textMeaningElement;
  };

  private textExampleElement = (): HTMLElement => {
    const textExampleElement: HTMLElement = createElement('div', [`${this.name}-text-example-item`]);

    const textExample: HTMLElement = createElement('p', [`${this.name}-text-example`, 'm-0']);
    textExample.innerHTML = this.word.textExample;
    const textExampleTranslate: HTMLElement = createElement(
      'p',
      [`${this.name}-text-example-translate`, 'm-0'],
      this.word.textExampleTranslate
    );

    textExampleElement.append(textExample, textExampleTranslate);

    return textExampleElement;
  };

  private createWordDescriptionElement = (): HTMLElement => {
    const descriptionElement: HTMLElement = createElement('div', [`${this.name}-description`, 'p-3']);

    descriptionElement.append(this.createWordElement(), this.createTextMeaningElement(), this.textExampleElement());

    return descriptionElement;
  };

  private createAudioIcon = (): HTMLElement => {
    const audioIcon = createElement('div', [
      `${this.name}-audio-icon`,
      'd-flex',
      'justify-content-center',
      'align-items-center',
      'shadow',
    ]);
    audioIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';

    return audioIcon;
  };

  private createButtons = (): HTMLElement => {
    const buttonsContainer: HTMLElement = createElement('div', [`${this.name}-buttons`, 'd-flex']);
    const difficultWordButton: HTMLButtonElement = createButtonElement(
      'button',
      'Difficult',
      'btn',
      'btn-difficult-word'
    );
    difficultWordButton.tabIndex = -1;
    if (this.Difficulty === 'hard') {
      difficultWordButton.classList.add('active');
      difficultWordButton.disabled = true;
    }

    difficultWordButton.onclick = async () => {
      difficultWordButton.classList.add('active');
      difficultWordButton.disabled = true;

      const marker = <HTMLDivElement>document.querySelector(`div[data-word-id = "${this.word.id}"] .word-card-marker`);
      marker.style.backgroundColor = Colors.Orange;

      if (this.userId) {
        if (!this.Difficulty) {
          const wordData: INewUserWordData = { difficulty: 'hard', optional: {} };
          await this.api.createUserWord({ userId: this.userId, wordId: this.word.id, wordData });
        }
        if (this.Difficulty === 'easy') {
          const userWord: INewUserWordData = await this.api.getUserWordById({
            userId: this.userId,
            wordId: this.word.id,
          });

          const wordData: INewUserWordData = { difficulty: 'hard', optional: userWord.optional };
          await this.api.updateUserWord({ userId: this.userId, wordId: this.word.id, wordData });
        }
      }
    };

    const learnedWordButton: HTMLButtonElement = createButtonElement('button', 'Learned', 'btn', 'btn-learned-word');
    learnedWordButton.tabIndex = -1;
    if (this.isLearned) {
      learnedWordButton.classList.add('active');
    }

    // learnedWordButton.onclick = async () => {

    //   if (this.userId && !this.Difficulty) {
    //     const wordData: INewUserWordData = { difficulty: 'easy', optional: { learned: true } };
    //     await this.api.createUserWord({ userId: this.userId, wordId: this.word.id, wordData });
    //     learnedWordButton.classList.add('active');
    //   }

    //   if (this.userId && this.isLearned) {
    //     const userWord: INewUserWordData = await this.api.getUserWordById({
    //       userId: this.userId,
    //       wordId: this.word.id,
    //     });

    //     const { optional } = userWord;
    //     optional.learned = false;

    //     const wordData: INewUserWordData = { difficulty: userWord.difficulty, optional };
    //     await this.api.updateUserWord({ userId: this.userId, wordId: this.word.id, wordData });
    //     learnedWordButton.classList.remove('active');
    //   }

    //   if (this.userId && !this.isLearned) {
    //     const userWord: INewUserWordData = await this.api.getUserWordById({
    //       userId: this.userId,
    //       wordId: this.word.id,
    //     });

    //     let { optional } = userWord;
    //     if (!optional) optional = {};
    //     optional.learned = true;

    //     const wordData: INewUserWordData = { difficulty: userWord.difficulty, optional };
    //     await this.api.updateUserWord({ userId: this.userId, wordId: this.word.id, wordData });
    //     learnedWordButton.classList.add('active');
    //   }

    //   // if (this.userId && this.isLearned) {
    //   //   const userWord: INewUserWordData = await this.api.getUserWordById({
    //   //     userId: this.userId,
    //   //     wordId: this.word.id,
    //   //   });

    //   //   const { optional } = userWord;
    //   //   optional.learned = false;

    //   //   const wordData: INewUserWordData = { difficulty: userWord.difficulty, optional };
    //   //   await this.api.updateUserWord({ userId: this.userId, wordId: this.word.id, wordData });
    //   //   learnedWordButton.classList.remove('active');
    //   // }
    // };

    buttonsContainer.append(difficultWordButton, learnedWordButton);

    return buttonsContainer;
  };

  render = (): HTMLElement => {
    this.container.setAttribute('data-word-id', this.word.id);
    this.container.append(
      this.createImage(),
      this.createMarkerElement(),
      this.createWordDescriptionElement(),
      this.createAudioIcon()
    );
    if (this.userId) {
      this.container.append(this.createButtons());
      if (this.isLearned) {
        this.container.classList.add('learned');
      }
    }

    return this.container;
  };
}

export default WordCard;

// audio: 'string';
// audioMeaning: 'string';
// audioExample: 'string';
