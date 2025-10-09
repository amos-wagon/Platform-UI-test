
import React from 'react';
// Import Shoelace custom elements loader
import '@shoelace-style/shoelace/dist/components/button/button.js';

import './App.css';


function App() {
  return (
    <div className="App creative-homepage">
      <header className="creative-header">
        <h1 className="plain-text">Hello, Amos!</h1>
        {/* Use Shoelace button as a web component, fallback to native button if needed */}
        <button className="sl-button">element Button</button>
        <div className="creative-footer">
        </div>
      </header>
    </div>
  );
}

export default App;
