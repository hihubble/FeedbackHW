import React from 'react';

import { Router, Route, Switch } from "react-router";
import FeatureList from './features/featureList/FeatureList';
import AddFeature from './features/addFeature/AddFeature';
import { createBrowserHistory } from 'history';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css'

function App() {

  

  const history = createBrowserHistory();
  return (
    <div className="App" style={{
      //backgroundImage: `url("wov_background.png")`
   }}>
      <header className="App-header">
      <Router history={history}>
        <Switch>
          <Route exact path="/"><FeatureList /></Route>
          <Route exact path="/suggest"><AddFeature /></Route>
        </Switch>
      </Router>
      </header>
      <ToastContainer />
    </div>
  );
}

export default App;
