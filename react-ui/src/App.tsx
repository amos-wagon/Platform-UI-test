import React from 'react';
import './App.css';

function App() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <header className="App-header">
        <form className="user-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required />

          <label htmlFor="dob">Date of Birth</label>
          <input id="dob" name="dob" type="date" required />

          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
