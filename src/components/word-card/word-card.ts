import { BASE_URL } from '../../common/constants';
import { IWord } from '../../common/types';
import { createElement } from '../../common/utils';

class WordCard {
  private container: HTMLElement;

  private className: string;

  constructor(private word: IWord, private color: string) {
    this.className = 'word-card';
    this.container = createElement('div', [
      'container',
      `${this.className}-container`,
      'd-flex',
      'shadow',
      'rounded-3',
    ]);
    this.word = word;
    this.color = color;
  }

  private createImage = (): HTMLElement => {
    const imageContainer: HTMLElement = createElement('div', [`${this.className}-image`]);

    const image: HTMLImageElement = new Image();
    image.src = `${BASE_URL}/${this.word.image}`;
    image.onload = () => {
      imageContainer.style.backgroundImage = `url(${image.src})`;
    };

    return imageContainer;
  };

  private createMarkerElement = (): HTMLElement => {
    const markerElement: HTMLElement = createElement('div', [`${this.className}-marker`]);
    markerElement.style.backgroundColor = this.color;

    return markerElement;
  };

  private createWordElement = (): HTMLElement => {
    const wordElement: HTMLElement = createElement('div', [`${this.className}-item`, 'd-flex', 'flex-wrap', 'mb-4']);

    const word: HTMLElement = createElement('h3', [`${this.className}-word`, 'text-capitalize'], this.word.word);
    const transcription: HTMLElement = createElement(
      'p',
      [`${this.className}-transcription`, 'ms-3', 'mb-0', 'pt-2'],
      this.word.transcription
    );
    const wordTranslate: HTMLElement = createElement(
      'p',
      [`${this.className}-translate`, 'm-0', 'w-100'],
      this.word.wordTranslate.toLowerCase()
    );

    wordElement.append(word, transcription, wordTranslate);

    return wordElement;
  };

  private createTextMeaningElement = (): HTMLElement => {
    const textMeaningElement: HTMLElement = createElement('div', [`${this.className}-text-meaning-item`, 'mb-4']);

    const textMeaning: HTMLElement = createElement('p', [`${this.className}-text-meaning`, 'm-0']);
    textMeaning.innerHTML = this.word.textMeaning;
    const textMeaningTranslate: HTMLElement = createElement(
      'p',
      [`${this.className}-text-meaning-translate`, 'm-0'],
      this.word.textMeaningTranslate
    );

    textMeaningElement.append(textMeaning, textMeaningTranslate);

    return textMeaningElement;
  };

  private textExampleElement = (): HTMLElement => {
    const textExampleElement: HTMLElement = createElement('div', [`${this.className}-text-example-item`]);

    const textExample: HTMLElement = createElement('p', [`${this.className}-text-example`, 'm-0']);
    textExample.innerHTML = this.word.textExample;
    const textExampleTranslate: HTMLElement = createElement(
      'p',
      [`${this.className}-text-example-translate`, 'm-0'],
      this.word.textExampleTranslate
    );

    textExampleElement.append(textExample, textExampleTranslate);

    return textExampleElement;
  };

  private createWordDescriptionElement = (): HTMLElement => {
    const descriptionElement: HTMLElement = createElement('div', [`${this.className}-description`, 'p-3']);

    descriptionElement.append(this.createWordElement(), this.createTextMeaningElement(), this.textExampleElement());

    return descriptionElement;
  };

  private createAudioIcon = (): HTMLElement => {
    const audioIcon = createElement('div', [
      `${this.className}-audio-icon`,
      'd-flex',
      'justify-content-center',
      'align-items-center',
      'shadow',
    ]);
    audioIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';

    return audioIcon;
  };

  render = (): HTMLElement => {
    this.container.setAttribute('data-id', this.word.id);
    this.container.append(
      this.createImage(),
      this.createMarkerElement(),
      this.createWordDescriptionElement(),
      this.createAudioIcon()
    );
    if (localStorage.getItem('UserId')) {
      console.log(localStorage.getItem('UserId'));
    }

    return this.container;
  };
}

export default WordCard;

// audio: 'string';
// audioMeaning: 'string';
// audioExample: 'string';
