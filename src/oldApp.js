import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function Welcome(props) {
  return <h2>Welcome, {props.name}!</h2>
}

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count+1);
  }
  
  return (
    <div>
      <p>You clicked {count} times!</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      {/* <Welcome name="Joseph Yohan"/>
      <Welcome name="Dizon"/>
      <Welcome name="Paras"/> */}
      <Counter />
    </div>
  );
}

export default App;
