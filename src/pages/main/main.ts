import { createElement } from '../../common/utils';
import free from './main-svg/free';
import repeat from './main-svg/repeat';
import book from './main-svg/book';
import sprint from './main-svg/sprint';
import audio from './main-svg/audio';
import stat from './main-svg/stat';
import together from './main-svg/together';
import gitIcon from './main-svg/git';

class Main {
  render(): void {
    const main = createElement('div', ['main-container']);
    const title = createElement('h1', ['main-title'], 'RSLang');
    const quote = createElement('h2', ['main-quote'], 'Your assistant in learning English');
    const advantages = createElement('h2', ['main-advantages'], 'Advantages');
    main.append(title);
    main.append(quote);
    main.append(advantages);
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
    slider.append(conteinerSlider);
    main.append(slider);
    const posibilities = createElement('h2', ['main-posibilities'], 'All posibilities');
    main.append(posibilities);
    const video = createElement('div', ['video-container']);
    video.innerHTML = `<iframe class='iframe-main' width="560" height="315" src="https://www.youtube.com/embed/kTpIBAmKPwo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    main.append(video);
    const team = createElement('h2', ['main-posibilities'], 'Our team');
    main.append(team);
    const teamplayerPersona = createElement('div', ['team-player', 'persona']);
    const avatarPersona = createElement('div', ['avatar-persona', 'team-player-avatar']);
    teamplayerPersona.append(avatarPersona);
    const infoPersona = createElement('div', ['team-player-info']);
    const namePersona = createElement('span', ['team-player-name'], 'personagrata9');
    infoPersona.append(namePersona);
    const teamPositionPersona = createElement('p', ['team-position'], 'Team leader, Frontend developer');
    infoPersona.append(teamPositionPersona);
    const contributionPersona = createElement(
      'p',
      ['contribution'],
      'Did basic project settings, create statistics, initial layout. Create textbook page and collection of statistics'
    );
    infoPersona.append(contributionPersona);
    const gitLinkPersona = createElement('a', ['git-link']);
    gitLinkPersona.innerHTML = gitIcon;
    gitLinkPersona.setAttribute('href', 'https://github.com/personagrata9');
    infoPersona.append(gitLinkPersona);
    teamplayerPersona.append(infoPersona);
    main.append(teamplayerPersona);
    const teamplayerCaptain = createElement('div', ['team-player', 'captain']);
    const avatarCaptain = createElement('div', ['avatar-captain', 'team-player-avatar']);
    teamplayerCaptain.append(avatarCaptain);
    const infoCaptain = createElement('div', ['team-player-info']);
    const nameCaptain = createElement('span', ['team-player-name'], 'KaPuTaH-UluTka');
    infoCaptain.append(nameCaptain);
    const teamPositionCaptain = createElement('p', ['team-position'], 'Frontend developer');
    infoCaptain.append(teamPositionCaptain);
    const contributionCaptain = createElement(
      'p',
      ['contribution'],
      'Create "Sprint" minigame, Api for work with back-end, statistics page and registration form,'
    );
    infoCaptain.append(contributionCaptain);
    const gitLinkCaptain = createElement('a', ['git-link']);
    gitLinkCaptain.innerHTML = gitIcon;
    gitLinkCaptain.setAttribute('href', 'https://github.com/kaputah-ulutka');
    infoCaptain.append(gitLinkCaptain);
    teamplayerCaptain.append(infoCaptain);
    main.append(teamplayerCaptain);
    const teamplayerAnterebol = createElement('div', ['team-player', 'anterebol']);
    const avatarAnterebol = createElement('div', ['avatar-anterebol', 'team-player-avatar']);
    teamplayerAnterebol.append(avatarAnterebol);
    const infoAnterebol = createElement('div', ['team-player-info']);
    const nameAnterebol = createElement('span', ['team-player-name'], 'anterebol');
    infoAnterebol.append(nameAnterebol);
    const teamPositionAnterebol = createElement('p', ['team-position'], 'Frontend developer');
    infoAnterebol.append(teamPositionAnterebol);
    const contributionAnterebol = createElement(
      'p',
      ['contribution'],
      'Create "Audio-challenge" minigame, create main page. Lorem ipsum///'
    );
    infoAnterebol.append(contributionAnterebol);
    const gitLinkAnterebol = createElement('a', ['git-link']);
    gitLinkAnterebol.innerHTML = gitIcon;
    gitLinkAnterebol.setAttribute('href', 'https://github.com/anterebol');
    infoAnterebol.append(gitLinkAnterebol);
    teamplayerAnterebol.append(infoAnterebol);
    main.append(teamplayerAnterebol);
    contentContainer.append(main);
  }
}
export default Main;
