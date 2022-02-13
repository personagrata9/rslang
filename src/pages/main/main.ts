class Main {
  render(): void {
    // console.log('Main');
    const main = document.createElement('div');
    main.innerHTML = 'main';

    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.append(main);
  }
}
export default Main;
