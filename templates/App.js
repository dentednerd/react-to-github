module.exports = `import React from 'react';
import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <main className="App">
      <Helmet>
        <title>
          React-to-Github
        </title>
        <meta name="description" content="React app created with react-to-github" />
      </Helmet>
      <header className="header">
        <p>
          Thanks for using
        </p>
        <h1>
          react-to-github
        </h1>
      </header>
      <div className="intro">
        <p>
          npm install -g react-to-github
          <br />
          react-to-github your-app your-github-username
        </p>
      </div>
    </main>
  );
};

export default App;
`;
