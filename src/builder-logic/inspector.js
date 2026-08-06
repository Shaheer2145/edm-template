// Original inspector logic preserved for later integration.
(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  function updateInspector() {
    const titleText = document.getElementById('inspector-subtitle');
    if (titleText) {
      titleText.textContent = selectedElement ? `${selectedElement.type.toUpperCase()}: ${selectedElement.id}` : 'Select an element to customize';
    }
  }

  function updateInspectorFields() {
    const form = document.getElementById('inspector-form');
    if (form && selectedElement) {
      form.innerHTML = `<div class="property-card"><h3>${selectedElement.type}</h3><p>Inspector content will be wired here later.</p></div>`;
    }
  }

  app.updateInspector = updateInspector;
  app.updateInspectorFields = updateInspectorFields;
  window.updateInspector = updateInspector;
  window.updateInspectorFields = updateInspectorFields;
})();