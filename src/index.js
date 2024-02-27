import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import RouterPages from './RouterPages';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { CadastroProvider } from './context/CadastroContext'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CadastroProvider>
          <RouterPages />
        </CadastroProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
