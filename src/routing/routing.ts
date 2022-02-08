import Main from '../pages/main/main';
import Textbook from '../pages/textbook/textbook';
import Minigames from '../pages/minigames/minigames';
import Statistics from '../pages/statistics/statistics';
import Sprint from '../pages/sprint/sprint';
import AudioChallenge from '../pages/audio-challenge/audio-challenge';

type RoutesType = {
  [key: string]: Main | Minigames | Statistics | Textbook | Sprint | AudioChallenge;
};

const main = new Main();
const textbook = new Textbook();
// const minigames = new Minigames();
const sprint = new Sprint();
const audioChallenge = new AudioChallenge();
const statistics = new Statistics();

const routes: RoutesType = {
  '': main,
  '#audio-challenge': audioChallenge,
  '#sprint': sprint,
  '#textbook': textbook,
  '#statistics': statistics,
};

export default routes;
