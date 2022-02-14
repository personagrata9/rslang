class Statistics {
  render(): void {
    // console.log('Statistics');
    const statistics = document.createElement('div');
    statistics.innerHTML = 'statistics';

    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.append(statistics);
  }
}
export default Statistics;
