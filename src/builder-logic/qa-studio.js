// Original QA Studio logic preserved for later integration.
(function () {
  const app = window.EDMBuilder = window.EDMBuilder || {};

  const QAStudio = {
    currentStep: 'step-ref',
    referenceImage: null,
    opacity: 0.5,
    isDiffMode: false,

    init(referenceImgSrc) {
      this.referenceImage = referenceImgSrc || this.referenceImage;
    },

    setReferenceImage(src) {
      this.referenceImage = src;
    },

    goToStep(stepName) {
      this.currentStep = stepName;
    }
  };

  app.QAStudio = QAStudio;
  window.QAStudio = QAStudio;
})();
