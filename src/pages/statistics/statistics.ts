import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { createElement } from '../../common/utils';

class Statistics {
  private statistics: HTMLElement;

  constructor() {
    this.statistics = createElement('div', ['statistic-wrapper']);
  }

  render(): void {
    this.statistics.innerHTML = '123123';
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    this.statistics.append(this.createStatisticContainer());
    contentContainer.append(this.statistics);
    this.script();
  }

  createStatisticContainer = (): HTMLElement => {
    const statisticContainer = createElement('div', []);
    const statisticCanvas = createElement('canvas', ['statistic-chart']);
    statisticContainer.append(statisticCanvas);
    return statisticContainer;
  };

  script = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45],
        },
      ],
    };

    const config = {
      type: 'line',
      data,
      options: {},
    };
    const myChart = new Chart(<ChartItem>document.querySelector('.statistic-chart'), <ChartConfiguration>config);
    myChart.render();
  };
}
export default Statistics;
