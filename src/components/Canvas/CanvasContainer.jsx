import React from 'react';

const CanvasContainer = ({ children, deviceMode = 'desktop', backgroundColor = '#ffffff' }) => {
  return (
    <div id="canvas-container" className={`canvas-container ${deviceMode}-view`} style={{ backgroundColor }}>
      <div id="canvas-root" className="canvas-root">
        {children}
      </div>
    </div>
  );
};

export default CanvasContainer;