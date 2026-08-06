// Original UI logic preserved for later integration.
(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function setupEventListeners() {
    document.querySelectorAll('.device-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function initApp() {
    setupEventListeners();
  }

  app.setupEventListeners = setupEventListeners;
  app.initApp = initApp;
  window.setupEventListeners = setupEventListeners;
  window.initApp = initApp;
})();
