class Main {
  async render(): Promise<HTMLDivElement> {
    console.log('Main');
    const main = document.createElement('div');
    main.innerHTML = 'main';
    return main;
  }
}
export default Main;
