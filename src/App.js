import './App.css';
import {Routes,Route} from "react-router-dom";

//components import 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import DustbinUI from './components/DustbinUI';

function App() {
  return (
   <>
     <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/dustbin" element={<DustbinUI/>} />
    </Routes>
   </>
  );
}

export default App;
