import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { createAnchorElement, createElement } from '../../common/utils';
import { GROUP_COLORS } from '../../common/constants';
import { ILongTermStatistics, IUserStatistics } from '../../common/types';
import { convertDate, parseTotalStatistics } from '../../state/helpers';
import Api from '../../api/api';

class Statistics {
  private statistics: HTMLElement;

  private totalWrong: number;

  private totalCorrect: number;

  private todayLearnedWords: number;

  private todayNewWords: number;

  private api: Api;

  private todayWinrate: number;

  private userId: string | null;

  constructor() {
    this.statistics = createElement('div', ['statistic-wrapper']);
    this.totalCorrect = 0;
    this.totalWrong = 0;
    this.todayNewWords = 0;
    this.todayLearnedWords = 0;
    this.todayWinrate = 0;
    this.userId = localStorage.getItem('UserId') || null;
    this.api = new Api();
  }

  async render(): Promise<void> {
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    const userStat = undefined;
    await this.api
      .getStatistics(this.userId || '')
      .then((result) => userStat === result)
      .catch((result) => userStat === result);
    if (!localStorage.getItem(`statistics${this.userId || ''}`) && typeof userStat !== 'object') {
      contentContainer.append(this.createNoStatisticBlock());
    } else {
      this.statistics.append(await this.createStatisticContainer());
      contentContainer.append(this.statistics);
      this.updateNum(this.todayNewWords, '.new-words-counter');
      this.updateNum(this.todayLearnedWords, '.learned-words-counter');
      this.updateNum(this.todayWinrate, '.percent-num');
      await this.winrateChart();
      await this.newWordsChart();
      await this.allLearnedWordsChart();
    }
  }

  private createStatisticContainer = async (): Promise<HTMLElement> => {
    const statisticContainer = createElement('div', ['statistic-container']);
    const longStatistic = createElement('div', ['long-statistic']);
    const shortStatistic = createElement('div', ['short-statistic']);
    shortStatistic.innerHTML = 'Today';
    longStatistic.innerHTML = 'All time';
    shortStatistic.append(await this.createShortStatistic());
    longStatistic.append(this.createLongStatistic());
    statisticContainer.append(shortStatistic, longStatistic);
    return statisticContainer;
  };

  private createShortStatistic = async (): Promise<HTMLElement> => {
    const statistic = <{ [key: string]: number }>await this.getShortStatistic();
    this.todayNewWords = statistic.newWordsNum;
    this.todayLearnedWords = statistic.totalLearned;
    this.todayWinrate = statistic.winrateNum;
    const shortStatisticContainer = createElement('div', ['short-statistic-container']);
    const sprintStatistic = createElement('div', ['container', 'sprint-statistic']);
    const audioStatistic = createElement('div', ['container', 'audio-statistic']);
    const totalStatistic = createElement('div', ['total-statistic']);
    const newWords = createElement('div', ['container', 'new-words-container']);
    const newWordsSpan = createElement('span', [], 'New words');
    const learnedWords = createElement('div', ['container', 'learned-words-container']);
    const learnedWordsSpan = createElement('span', [], 'Learned words');
    const winrate = createElement('div', ['container', 'winrate-container']);
    const winrateSpan = createElement('span', [], 'Winrate');
    newWords.append(this.createNewWordsCircle(), newWordsSpan);
    learnedWords.append(this.createLearnedWordsCircle(), learnedWordsSpan);
    winrate.append(this.createWinrateCircle(statistic.winrateNum), winrateSpan);
    totalStatistic.append(newWords, learnedWords, winrate);
    const sprintPic = createElement('div', ['sprint-pic']);
    const sprintNewWords = createElement('p', ['sprint__new-words'], `New words: ${statistic.sprintNewWordsNum}`);
    const sprintWinrate = createElement('p', ['sprint__winrate'], `Winrate: ${statistic.sprintWinrateNum}%`);
    const sprintWinstreak = createElement('p', ['sprint__winstreak'], `Winstreak: ${statistic.sprintWinstreakNum}`);
    const audioPic = createElement('div', ['audio-pic']);
    const audioNewWords = createElement('p', ['audio__new-words'], `New words: ${statistic.audioNewWordsNum}`);
    const audioWinrate = createElement('p', ['audio__winrate'], `Winrate: ${statistic.audioWinrateNum}%`);
    const audioWinstreak = createElement('p', ['audio__winstreak'], `Winstreak: ${statistic.audioWinstreakNum}`);
    audioStatistic.append(audioPic, audioNewWords, audioWinrate, audioWinstreak);
    sprintStatistic.append(sprintPic, sprintNewWords, sprintWinrate, sprintWinstreak);
    shortStatisticContainer.append(totalStatistic, audioStatistic, sprintStatistic);
    return shortStatisticContainer;
  };

  private createLongStatistic = (): HTMLElement => {
    const longStatisticContainer = createElement('div', ['long-statistic-container']);
    const totalWinrate = createElement('div', ['container', 'total-winrate']);
    const learnedWords = createElement('div', ['container', 'learned-words']);
    const totalLearnedWords = createElement('div', ['container', 'total-learned-words']);
    const winrateChart = createElement('canvas', ['winrate-chart']);
    const winratePercent = createElement('p', ['winrate-percent']);
    const winrateText = createElement('p', ['winrate-text'], 'Winrate');
    const shortLearnedWordsChart = createElement('canvas', ['words-chart']);
    const longLearnedWordsChart = createElement('canvas', ['learned-words-chart']);
    totalLearnedWords.append(longLearnedWordsChart);
    totalWinrate.append(winrateChart, winratePercent, winrateText);
    learnedWords.append(shortLearnedWordsChart);
    longStatisticContainer.append(totalWinrate, learnedWords, totalLearnedWords);
    return longStatisticContainer;
  };

  private getShortStatistic = async (): Promise<{
    [key: string]: number;
  }> => {
    let totalLearned = 0;
    let sprintCorrect = 0;
    let sprintWrong = 0;
    let audioCorrect = 0;
    let audioWrong = 0;
    let totalWrong = 0;
    let totalCorrect = 0;
    let newWordsNum = 0;
    let winrateNum = 0;
    let sprintNewWordsNum = 0;
    let sprintWinrateNum = 0;
    let sprintWinstreakNum = 0;
    let audioNewWordsNum = 0;
    let audioWinrateNum = 0;
    let audioWinstreakNum = 0;
    if (this.userId) {
      await this.api.getStatistics(this.userId || '').then((result: IUserStatistics) => {
        if (result.optional.longTerm[convertDate(new Date())]) {
          totalLearned = result.optional.longTerm[convertDate(new Date())].learned;
          sprintCorrect = result.optional.sprint.correct;
          sprintWrong = result.optional.sprint.wrong;
          audioCorrect = result.optional.audioChallenge.correct;
          audioWrong = result.optional.audioChallenge.wrong;
          totalWrong = audioWrong + sprintWrong;
          totalCorrect = audioCorrect + sprintCorrect;

          winrateNum = Math.ceil((totalCorrect / (totalCorrect + totalWrong)) * 100) || 0;
          sprintNewWordsNum = result.optional.sprint.new;
          sprintWinrateNum = Math.ceil((sprintCorrect / (sprintCorrect + sprintWrong)) * 100) || 0;
          sprintWinstreakNum = result.optional.sprint.bestSeries;
          audioNewWordsNum = result.optional.audioChallenge.new;
          audioWinrateNum = Math.ceil((audioCorrect / (audioCorrect + audioWrong)) * 100) || 0;
          audioWinstreakNum = result.optional.audioChallenge.bestSeries;
          newWordsNum = sprintNewWordsNum + audioNewWordsNum;
        }
      });
    } else {
      const userStatistics = localStorage.getItem(`statistics${this.userId || ''}`) || '';
      const shortStatistic = parseTotalStatistics(userStatistics);
      if (shortStatistic.date === convertDate(new Date())) {
        const reducer = (obj: object) =>
          Object.values(obj)
            .map(Number)
            .reduce((a, b) => a + b, 0);
        totalLearned = shortStatistic.totalLearned.size;
        sprintCorrect = reducer(shortStatistic.sprint.correct);
        sprintWrong = reducer(shortStatistic.sprint.wrong);
        audioCorrect = reducer(shortStatistic.audioChallenge.correct);
        audioWrong = reducer(shortStatistic.audioChallenge.wrong);
        totalWrong = sprintWrong + audioWrong;
        totalCorrect = sprintCorrect + audioCorrect;

        newWordsNum = shortStatistic.totalNew.size;
        winrateNum = Math.ceil((totalCorrect / (totalCorrect + totalWrong)) * 100) || 0;
        sprintNewWordsNum = shortStatistic.sprint.new.size;
        sprintWinrateNum = Math.ceil((sprintCorrect / (sprintCorrect + sprintWrong)) * 100) || 0;
        sprintWinstreakNum = shortStatistic.sprint.bestSeries;
        audioNewWordsNum = shortStatistic.audioChallenge.new.size;
        audioWinrateNum = Math.ceil((audioCorrect / (audioCorrect + audioWrong)) * 100) || 0;
        audioWinstreakNum = shortStatistic.audioChallenge.bestSeries;
      }
    }
    return {
      totalLearned,
      newWordsNum,
      winrateNum,
      sprintNewWordsNum,
      sprintWinrateNum,
      sprintWinstreakNum,
      audioNewWordsNum,
      audioWinrateNum,
      audioWinstreakNum,
    };
  };

  private getLongStatistic = async () => {
    const dateArr: string[] = [];
    const learnedWordsArr: number[] = [];
    const newWordsArr: number[] = [];
    let userStatistic;
    if (this.userId) {
      await this.api.getStatistics(this.userId || '').then((result: IUserStatistics) => {
        userStatistic = result.optional.longTerm;
        Object.entries(userStatistic).forEach((e) => {
          dateArr.push(e[0]);
          learnedWordsArr.push(e[1].learned);
          newWordsArr.push(e[1].new);
        });
      });
    } else {
      userStatistic = <ILongTermStatistics>await JSON.parse(localStorage.getItem('longTermStatistics') || '');
      Object.entries(userStatistic).forEach((e) => {
        dateArr.push(e[0]);
        learnedWordsArr.push(e[1].learned);
        newWordsArr.push(e[1].new);
      });
    }
    const updateDateArr = dateArr.map((el) => {
      const year = el.slice(0, 4);
      const month = el.slice(4, 6);
      const day = el.slice(6, 9);
      return `${day}.${month}.${year}`;
    });
    return {
      userStatistic,
      updateDateArr,
      learnedWordsArr,
      newWordsArr,
    };
  };

  private createNewWordsCircle = (): HTMLElement => {
    const newWordsCircleWrapper = createElement('div', ['winrate__circle-wrapper']);
    const newWordsCircleContainer = createElement('div', ['winrate__circle-container-basic']);
    const newWordsCircleBody = createElement('div', ['winrate__circle-body']);
    const newWordsCircleCounter = createElement('div', ['winrate__circle-counter']);
    const newWordsNum = createElement('span', ['new-words-counter'], `0`);
    newWordsCircleCounter.append(newWordsNum);
    newWordsCircleBody.append(newWordsCircleCounter);
    newWordsCircleContainer.append(newWordsCircleBody);
    newWordsCircleWrapper.append(newWordsCircleContainer);
    return newWordsCircleWrapper;
  };

  private createLearnedWordsCircle = (): HTMLElement => {
    const learnedWordsCircleWrapper = createElement('div', ['winrate__circle-wrapper']);
    const learnedWordsCircleContainer = createElement('div', ['winrate__circle-container-basic']);
    const learnedWordsCircleBody = createElement('div', ['winrate__circle-body']);
    const learnedWordsCircleCounter = createElement('div', ['winrate__circle-counter']);
    const learnedWordsNum = createElement('span', ['learned-words-counter'], `0`);
    learnedWordsCircleCounter.append(learnedWordsNum);
    learnedWordsCircleBody.append(learnedWordsCircleCounter);
    learnedWordsCircleContainer.append(learnedWordsCircleBody);
    learnedWordsCircleWrapper.append(learnedWordsCircleContainer);
    return learnedWordsCircleWrapper;
  };

  private createWinrateCircle = (winrate: number): HTMLElement => {
    const winrateCircleWrapper = createElement('div', ['winrate__circle-wrapper']);
    const winrateCircleContainer = createElement('div', ['winrate__circle-container']);
    const winrateCircleBody = createElement('div', ['winrate__circle-body']);
    const winrateCircleCounter = createElement('div', ['winrate__circle-counter']);
    const winrateNum = createElement('span', ['percent-num']);
    const percentSymbol = createElement('span', [], '%');
    const root = <HTMLElement>document.querySelector(':root');
    root.style.setProperty('--win-height', `${winrate}%`);
    winrateCircleCounter.append(winrateNum, percentSymbol);
    winrateCircleBody.append(winrateCircleCounter);
    winrateCircleContainer.append(winrateCircleBody);
    winrateCircleWrapper.append(winrateCircleContainer);
    return winrateCircleWrapper;
  };

  private winrateChart = async (): Promise<void> => {
    const longStatistic = <{ userStatistic: ILongTermStatistics; updateDateArr: string[]; wordsArr: number[] }>(
      (<unknown>await this.getLongStatistic())
    );
    const statistics = longStatistic.userStatistic;
    Object.values(statistics).forEach((e) => {
      this.totalWrong += +e.wrong;
      this.totalCorrect += +e.correct;
    });
    (<HTMLElement>document.querySelector('.winrate-percent')).innerText = `${Math.ceil(
      (this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100
    )}%`;
    const labels = ['Correct answers', 'Wrong answers'];
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'statistic',
          backgroundColor: [GROUP_COLORS[0], GROUP_COLORS[5]],
          data: [this.totalCorrect, this.totalWrong],
          hoverOffset: 4,
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

  private newWordsChart = async (): Promise<void> => {
    const statistic = await this.getLongStatistic();
    const labels = statistic.updateDateArr;
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'New words per day',
          backgroundColor: [...GROUP_COLORS],
          data: statistic.newWordsArr.map((el, i, arr1) => arr1.slice(0, i + 1).reduce((a, b) => a + b)),
        },
      ],
    };
    const config = {
      type: 'bar',
      data,
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: Math.max(...statistic.newWordsArr) + 5,
          },
          x: {
            display: false,
          },
        },
      },
    };
    const myChart = new Chart(<ChartItem>document.querySelector('.words-chart'), <ChartConfiguration>config);
    myChart.render();
  };

  private allLearnedWordsChart = async (): Promise<void> => {
    const statistic = await this.getLongStatistic();
    const labels = statistic.updateDateArr;
    Chart.register(...registerables);
    const data = {
      labels,
      datasets: [
        {
          label: 'Total learned words',
          backgroundColor: [...GROUP_COLORS],
          borderColor: GROUP_COLORS[0],
          data: statistic.learnedWordsArr.map((el, i, arr1) => arr1.slice(0, i + 1).reduce((a, b) => a + b)),
        },
      ],
    };
    const config = {
      type: 'line',
      data,
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: Math.max(...statistic.learnedWordsArr) + 5,
          },
          x: {
            display: false,
          },
        },
      },
    };
    const myChart = new Chart(<ChartItem>document.querySelector('.learned-words-chart'), <ChartConfiguration>config);
    myChart.render();
  };

  private createNoStatisticBlock = (): HTMLElement => {
    const clearBlock = createElement('div', ['clear-block-wrapper']);
    const clearBlockContainer = createElement('div', ['clear-block-container']);
    const clearBlockTitle = createElement('p', ['clear-block-title'], "Ooops... You haven't statistic.");
    const textbookBtn = createAnchorElement('#textbook', "Let's go to knowledge", 'btn', 'to-textbook-btn');
    clearBlockContainer.append(clearBlockTitle, textbookBtn);
    clearBlock.append(clearBlockContainer);
    return clearBlock;
  };

  private updateNum = (num: number, elem: string): void => {
    const time = 3000;
    const step = 1;
    const counter = <HTMLElement>document.querySelector(elem);
    let n = 0;
    const t = Math.round(time / (num / step));
    if (num === 0) {
      counter.innerHTML = String(num);
    } else {
      const interval = setInterval(() => {
        n += step;
        if (n === num) {
          clearInterval(interval);
        }
        counter.innerHTML = String(n);
      }, t);
    }
  };
}
export default Statistics;
