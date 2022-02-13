class Minigames {
  render(): void {
    // console.log('Minigames');
    const minigames = document.createElement('div');
    minigames.innerHTML = 'minigames';

    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.append(minigames);
  }
}
export default Minigames;
