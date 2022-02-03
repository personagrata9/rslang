class Aside {
  render() {
    console.log('aside');
    const aside = document.createElement('aside');
    aside.innerHTML = 'aside';
    return aside;
  }
}
export default Aside;
