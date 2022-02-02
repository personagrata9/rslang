/* eslint-disable prettier/prettier */
class Render {
  nameDiv: string;

  innerContent: string;

  constructor(nameDiv: string, innerContent: string) {
    this.nameDiv = nameDiv;
    this.innerContent = innerContent;
  }

  render() {
    const box = document.createElement('div');
    box.className = this.nameDiv;
    box.innerHTML = this.innerContent;
    return box;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { Render };
