import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { createElement } from '../../common/utils';
import { GROUP_COLORS } from '../../common/constants';

class Statistics {
  private statistics: HTMLElement;

  constructor() {
    this.statistics = createElement('div', ['statistic-wrapper']);
  }

  render(): void {
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    this.statistics.append(this.createStatisticContainer());
    contentContainer.append(this.statistics);
    this.winrateChart();
    this.wordsChart();
  }

  createStatisticContainer = (): HTMLElement => {
    const statisticContainer = createElement('div', ['statistic-container']);
    const longStatistic = createElement('div', ['long-statistic']);
    const shortStatistic = createElement('div', ['short-statistic']);
    shortStatistic.innerHTML = 'Today';
    longStatistic.innerHTML = 'All time';
    shortStatistic.append(this.createShortStatistic());
    longStatistic.append(this.createLongStatistic());
    statisticContainer.append(shortStatistic, longStatistic);
    return statisticContainer;
  };

  createShortStatistic = (): HTMLElement => {
    const shortStatisticContainer = createElement('div', ['short-statistic-container']);
    const sprintStatistic = createElement('div', ['container', 'sprint-statistic']);
    const audioStatistic = createElement('div', ['container', 'audio-statistic']);
    const totalStatistic = createElement('div', ['total-statistic']);
    const newWords = createElement('div', ['container', 'new-words-container'], `${2}`);
    const winrate = createElement('div', ['container', 'winrate-container'], `${2}`);
    totalStatistic.append(newWords, winrate);
    const sprintPic = createElement('div', ['sprint-pic']);
    const sprintNewWords = createElement('p', ['sprint__new-words'], `New words: ${2}`);
    const sprintWinrate = createElement('p', ['sprint__winrate'], `Winrate: ${2}`);
    const sprintWinstreak = createElement('p', ['sprint__winstreak'], `Winstreak: ${2}`);
    const audioPic = createElement('div', ['audio-pic']);
    const audioNewWords = createElement('p', ['audio__new-words'], `New words: ${2}`);
    const audioWinrate = createElement('p', ['audio__winrate'], `Winrate: ${2}`);
    const audioWinstreak = createElement('p', ['audio__winstreak'], `Winstreak: ${2}`);
    audioStatistic.append(audioPic, audioNewWords, audioWinrate, audioWinstreak);
    sprintStatistic.append(sprintPic, sprintNewWords, sprintWinrate, sprintWinstreak);
    shortStatisticContainer.append(totalStatistic, audioStatistic, sprintStatistic);
    return shortStatisticContainer;
  };

  createLongStatistic = (): HTMLElement => {
    const longStatisticContainer = createElement('div', ['long-statistic-container']);
    const totalWinrate = createElement('div', ['total-winrate']);
    const totalWords = createElement('div', ['total-words']);
    const winrateChart = createElement('canvas', ['winrate-chart']);
    const wordsChart = createElement('canvas', ['words-chart']);
    totalWinrate.append(winrateChart);
    totalWords.append(wordsChart);
    longStatisticContainer.append(totalWinrate, totalWords);
    return longStatisticContainer;
  };

  winrateChart = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'statistic',
          backgroundColor: ['red', 'green', 'blue', 'purple', 'black', 'gray'],
          borderColor: GROUP_COLORS[1],
          data: [0, 10, 5, 2, 20, 30, 45],
        },
      ],
    };

    const config = {
      type: 'doughnut',
      data,
      options: {},
    };
    const myChart = new Chart(<ChartItem>document.querySelector('.winrate-chart'), <ChartConfiguration>config);
    myChart.render();
  };

  wordsChart = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'statistic',
          backgroundColor: ['red', 'green', 'blue', 'purple', 'black', 'gray'],
          borderColor: GROUP_COLORS[1],
          data: [0, 10, 5, 2, 20, 30, 45],
        },
      ],
    };

    const config = {
      type: 'doughnut',
      data,
      options: {},
    };
    const myChart = new Chart(<ChartItem>document.querySelector('.words-chart'), <ChartConfiguration>config);
    myChart.render();
  };
}
export default Statistics;
