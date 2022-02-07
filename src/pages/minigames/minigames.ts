class Minigames {
  async render(): Promise<HTMLDivElement> {
    console.log('Minigames');
    const minigames = document.createElement('div');
    minigames.innerHTML = 'minigames';
    return minigames;
  }
}
export default Minigames;
