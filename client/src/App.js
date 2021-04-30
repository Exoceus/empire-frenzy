import './App.css';


import Join from './components/join';
import Room from './components/room';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/room" component={Room} />
    </Router>
  );
}
export default App;
