import React, { useState } from 'react';
import BookList from './components/BookList';
import ErrorSnackbar from './components/ErrorSnackbar';
import './styles/_bem.scss';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App: React.FC = () => {
  const [error, setError] = useState('');

  const handleError = (msg: string) => {
    setError(msg);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Book Repository</h1>
      <BookList onError={handleError} />
      <ErrorSnackbar
        open={!!error}
        message={error}
        onClose={() => setError('')}
      />
    </div>
  );
};

export default App;
