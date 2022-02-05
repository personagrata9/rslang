import { BASE_URL } from '../../common/constants';
import { IWord } from '../../common/types';
import { createDivElement, createHeadingElement, createParagraphElement } from '../../common/utils';

class WordCard {
  private container: HTMLDivElement;

  private className: string;

  constructor(private word: IWord, private color: string) {
    this.className = 'word-card';
    this.container = createDivElement('container', `${this.className}-container`, 'd-flex', 'shadow', 'rounded-3');
    this.word = word;
    this.color = color;
  }

  private createImage = (): HTMLDivElement => {
    const imageContainer: HTMLDivElement = createDivElement(`${this.className}-image`);

    const image: HTMLImageElement = new Image();
    image.src = `${BASE_URL}/${this.word.image}`;
    image.onload = () => {
      imageContainer.style.backgroundImage = `url(${image.src})`;
    };

    return imageContainer;
  };

  private createMarkerElement = (): HTMLDivElement => {
    const markerElement: HTMLDivElement = createDivElement(`${this.className}-marker`);
    markerElement.style.backgroundColor = this.color;

    return markerElement;
  };

  private createWordElement = (): HTMLDivElement => {
    const wordElement: HTMLDivElement = createDivElement(`${this.className}-item`, 'd-flex', 'flex-wrap', 'mb-4');

    const word: HTMLHeadingElement = createHeadingElement(
      'h3',
      this.word.word,
      `${this.className}-word`,
      'text-capitalize'
    );
    const transcription: HTMLParagraphElement = createParagraphElement(
      this.word.transcription,
      `${this.className}-transcription`,
      'ms-3',
      'mb-0',
      'pt-2'
    );
    const wordTranslate: HTMLParagraphElement = createParagraphElement(
      this.word.wordTranslate.toLowerCase(),
      `${this.className}-translate`,
      'm-0',
      'w-100'
    );

    wordElement.append(word, transcription, wordTranslate);

    return wordElement;
  };

  private createTextMeaningElement = (): HTMLDivElement => {
    const textMeaningElement: HTMLDivElement = createDivElement(`${this.className}-text-meaning-item`, 'mb-4');

    const textMeaning: HTMLParagraphElement = createParagraphElement(
      this.word.textMeaning,
      `${this.className}-text-meaning`,
      'm-0'
    );
    const textMeaningTranslate: HTMLParagraphElement = createParagraphElement(
      this.word.textMeaningTranslate,
      `${this.className}-text-meaning-translate`,
      'm-0'
    );

    textMeaningElement.append(textMeaning, textMeaningTranslate);

    return textMeaningElement;
  };

  private textExampleElement = (): HTMLDivElement => {
    const textExampleElement: HTMLDivElement = createDivElement(`${this.className}-text-example-item`);

    const textExample: HTMLParagraphElement = createParagraphElement(
      this.word.textExample,
      `${this.className}-text-example`,
      'm-0'
    );
    const textExampleTranslate: HTMLParagraphElement = createParagraphElement(
      this.word.textExampleTranslate,
      `${this.className}-text-example-translate`,
      'm-0'
    );

    textExampleElement.append(textExample, textExampleTranslate);

    return textExampleElement;
  };

  private createWordDescriptionElement = (): HTMLDivElement => {
    const descriptionElement: HTMLDivElement = createDivElement(`${this.className}-description`, 'p-3');

    descriptionElement.append(this.createWordElement(), this.createTextMeaningElement(), this.textExampleElement());

    return descriptionElement;
  };

  private createAudioIcon = (): HTMLElement => {
    const audioIcon = createDivElement(
      `${this.className}-audio-icon`,
      'd-flex',
      'justify-content-center',
      'align-items-center',
      'shadow'
    );
    audioIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';

    return audioIcon;
  };

  render = (): HTMLDivElement => {
    this.container.setAttribute('data-id', this.word.id);
    this.container.append(
      this.createImage(),
      this.createMarkerElement(),
      this.createWordDescriptionElement(),
      this.createAudioIcon()
    );

    return this.container;
  };
}

export default WordCard;

// audio: 'string';
// audioMeaning: 'string';
// audioExample: 'string';
