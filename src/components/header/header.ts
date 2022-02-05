class Header {
  render() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
    <div class="header-nav">
      <div class="left-part-header">
        <div class="hamburger">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </div>
        <p class="app-logo">
          <span class="rs">RS</span>
          <span class="lang">lang</span>
        </p>  
      </div>
      <p class="page-name">Page name</p>
      <button class="btn btn-outline-light btn-sg px-3" type="submit">Sign in</button>
    </div>`;
    return header;
  }
}
export default Header;
