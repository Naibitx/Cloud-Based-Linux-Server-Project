import './App.css';
import dashboard from './assets/dashboard.png';
import Metrics from './components/metrics.js';
import Dashboard from './components/dashboard.js';


function App() {
  return (
    <div className="App">
      
      <header className="App-header">
        <img src={dashboard} alt="Cloud Based Dashbaord" className="App-title" />
        <Metrics/>
        <Dashboard/>
      </header>
    </div>
  );
}

export default App;
