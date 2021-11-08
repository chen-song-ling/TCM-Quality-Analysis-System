import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Project from './pages/Project';
import Character from './pages/Character';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Chrom from './pages/Chrom';
import Micro from './pages/Micro';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/character" component={Character} />
          <Route path="/chrom" component={Chrom} />
          <Route path="/micro" component={Micro} />
          <Route path="/project" component={Project} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/admin-register" component={AdminLogin} />
          <Route path="/" component={Login} />
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
