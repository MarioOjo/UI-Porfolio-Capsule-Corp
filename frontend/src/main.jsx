import React from 'react'
import { createRoot } from 'react-dom/client'

// Try to import App if it exists
let App
try {
  App = require('./App').default
} catch (e) {
  // If App isn't present, render a helpful fallback UI
  App = function Fallback() {
    return React.createElement('div', { style: {padding:20, fontFamily:'sans-serif'} }, [
      React.createElement('h2', { key: 'h' }, 'App entry missing'),
      React.createElement('p', { key: 'p' }, 'No `src/App.jsx` was found. Create one to mount your app.'),
    ])
  }
}

const root = createRoot(document.getElementById('root'))
root.render(React.createElement(App))
