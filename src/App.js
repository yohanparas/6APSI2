import logo from './logo.svg';
import './App.css';

function Welcome(props) {
  return <h2>Welcome, {props.name}!</h2>
}

function App() {
  return (
    <div className="App">
      <Welcome name="Joseph Yohan"/>
      <Welcome name="Dizon"/>
      <Welcome name="Paras"/>
    </div>
  );
}

export default App;
