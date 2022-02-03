import Main from '../pages/main/main';
import Textbook from '../pages/textbook/textbook';
import Minigames from '../pages/minigames/minigames';
import Statistics from '../pages/statistics/statistics';

type RoutesType = {
  [key: string]: Main | Minigames | Statistics | Textbook;
};

const main = new Main();
const textbook = new Textbook();
const minigames = new Minigames();
const statistics = new Statistics();

const routes: RoutesType = {
  '': main,
  '#minigames': minigames,
  '#textbook': textbook,
  '#statistics': statistics,
};

export default routes;
