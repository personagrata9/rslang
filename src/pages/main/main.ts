import { createElement } from '../../common/utils';
import free from './main-svg/free';
import repeat from './main-svg/repeat';
import book from './main-svg/book';
import sprint from './main-svg/sprint';
import audio from './main-svg/audio';
import stat from './main-svg/stat';
import together from './main-svg/together';

class Main {
  render(): void {
    let counter = 0;
    const main = createElement('div', ['main-container']);
    const messegeContainer = createElement('div', ['main-messege-container']);
    const title = createElement('h1', ['main-title'], 'RSLang');
    const quote = createElement('h2', ['main-quote'], 'Your assistant in learning English');
    messegeContainer.append(title);
    messegeContainer.append(quote);
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    const slider = createElement('div', ['slider']);
    const conteinerSlider = createElement('div', ['slider-container']);
    const freeContainer = createElement('div', ['info-main-container']);
    freeContainer.innerHTML = free;
    const freeText = createElement(
      'p',
      ['free-text', 'main-text'],
      'Our application provides a unique opportunity to learn English words absolutely free and in a short time'
    );
    freeContainer.append(freeText);
    conteinerSlider.append(freeContainer);
    const repeatContainer = createElement('div', ['info-main-container']);
    repeatContainer.innerHTML = repeat;
    const repeatText = createElement(
      'p',
      ['repeat-text', 'main-text'],
      'Learn English every day, repeat words - succeed!'
    );
    repeatContainer.append(repeatText);
    conteinerSlider.append(repeatContainer);
    const shortInfoContainer = createElement('div', ['info-main-container']);
    shortInfoContainer.innerHTML = book;
    const shortInfoText = createElement(
      'p',
      ['book-text', 'main-text'],
      'The application has 2 mini-games and a page with a textbook where you can mark the words you learned earlier'
    );
    shortInfoContainer.append(shortInfoText);
    conteinerSlider.append(shortInfoContainer);
    const sprintContainer = createElement('div', ['info-main-container']);
    sprintContainer.innerHTML = sprint;
    const sprintText = createElement(
      'p',
      ['sprint-text', 'main-text'],
      'Sprint - the main thing is to accurately and quickly mark the correctness of the translation of the word, for each correct answer get points and grow with us'
    );
    sprintContainer.append(sprintText);
    conteinerSlider.append(sprintContainer);
    const audioContainer = createElement('div', ['info-main-container']);
    audioContainer.innerHTML = audio;
    const audioText = createElement(
      'p',
      ['audio-text', 'main-text'],
      'Audio-challenge - a game in which for successful completion you need to listen to the word and choose the correct translation from the options below - 5 options.'
    );
    audioContainer.append(audioText);
    conteinerSlider.append(audioContainer);
    const statisticsContainer = createElement('div', ['info-main-container']);
    statisticsContainer.innerHTML = stat;
    const statisticsText = createElement(
      'p',
      ['statistics-text', 'main-text'],
      'Every day your progress will grow and be marked on the statistics page'
    );
    statisticsContainer.append(statisticsText);
    conteinerSlider.append(statisticsContainer);
    const togetherContainer = createElement('div', ['info-main-container']);
    togetherContainer.innerHTML = together;
    const togetherText = createElement(
      'p',
      ['statistics-text', 'main-text'],
      'Register and go to the conquest of the English language with our development team!'
    );
    togetherContainer.append(togetherText);
    conteinerSlider.append(togetherContainer);
    const prevButton = createElement('button', ['prev-button', 'main-button'], '←');
    prevButton.addEventListener('click', () => {
      if (counter > 0) {
        counter -= 1;
      } else {
        counter = 6;
      }
      conteinerSlider.style.left = `-${500 * counter}px`;
    });
    const nextButton = createElement('button', ['next-button', 'main-button'], '→');
    nextButton.addEventListener('click', () => {
      if (counter < 6) {
        counter += 1;
      } else {
        counter = 0;
      }
      conteinerSlider.style.left = `-${500 * counter}px`;
    });
    slider.append(prevButton, nextButton);
    slider.append(conteinerSlider);
    messegeContainer.append(slider);
    const video = createElement('div', ['video-container']);
    video.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/kTpIBAmKPwo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    messegeContainer.append(video);
    const titleDevelops = createElement('h1', ['develop-title'], 'Develops...');
    messegeContainer.append(titleDevelops);
    main.append(messegeContainer);
    contentContainer.append(main);
  }
}
export default Main;
