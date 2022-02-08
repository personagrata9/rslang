class Sprint {
  async render(): Promise<HTMLDivElement> {
    const minigames = document.createElement('div');
    minigames.innerHTML = 'Sprint';
    return minigames;
  }
}
export default Sprint;
