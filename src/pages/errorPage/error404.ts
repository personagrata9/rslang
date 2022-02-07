class Error404 {
  render(): void {
    console.log('Error404');
    const error404 = document.createElement('div');
    error404.innerHTML = 'error404';

    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.append(error404);
  }
}
export default Error404;
