import logo from './logo.svg';
import './App.css';
import Metrics from './components/metrics.js';
import Dashboard from './components/dashboard.js';

function App() {
  return (
    <div className="App">
      
      <header className="App-header">
        <h1>Cloud Based System Dashboard</h1>
        <Metrics/>
        <Dashboard/>
      </header>
    </div>
  );
}

export default App;
