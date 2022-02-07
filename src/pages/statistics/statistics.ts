class Statistics {
  async render(): Promise<HTMLDivElement> {
    console.log('Statistics');
    const statistics = document.createElement('div');
    statistics.innerHTML = 'statistics';
    return statistics;
  }
}
export default Statistics;
