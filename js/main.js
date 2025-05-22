function loadNavbar() {
  fetch('/components/header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('head-nav').innerHTML = data;
      const navbar = document.getElementById('navbar');

      // Attach to window so they can be called from HTML onclick
      window.openSidebar = function () {
        navbar.classList.add('show');
      }

      window.closeSidebar = function () {
        navbar.classList.remove('show');
      }
    });
}

window.addEventListener('DOMContentLoaded', loadNavbar);

function loadFooter() {
  fetch('/components/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
}
window.addEventListener('DOMContentLoaded', loadFooter);