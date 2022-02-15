import logo from './logo';

const headerHtml = `
<div class="header-nav">
  <div class="app-logo">${logo}</div> 
  <p class="page-name">Page name</p>
  <span class="user-name"></span>
  <button class="btn btn-outline-light btn-sg px-3 open-popup" type="button">Sign in</button>
  <button class="btn btn-outline-light btn-sg px-3 logout hide" type="button">Logout</button>
</div>`;
export default headerHtml;
