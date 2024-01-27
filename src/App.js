import logo from './logo.svg';
import './App.css';
import Login from './Login';
import AuthProvider from './AuthProvider';
import Dashboard from "./Dashboard"
import PrivateRoute from './PrivateRoute';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
function App() {
  return (
    <div className="App">
       <Login></Login>
    </div>
  );
}

export default App;
