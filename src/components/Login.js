import React, {useState,useEffect} from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

//icons
import {IoCloseCircleOutline} from 'react-icons/io5'
import {FcGoogle} from "react-icons/fc"
function Login() {

  let navigate = useNavigate();
  const [values, setValues] = useState({
    email:"",
    password:""
  })
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [DustbinID, setDustbinID] = useState(searchParams.get('Did'));
  const [linkText,setlinkText] = useState("");
  useEffect(() => {
    if(DustbinID != null){
      setlinkText("/signup/?Did="+DustbinID); 
    }
    else{
      setlinkText("/signup");
    }
  }, [DustbinID])

  const handleSubmit = () => {
    
    if(!values.email || !values.password){
      alert("Please fill all the fields");
      return;
    }
    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth,values.email,values.password).then(async res=>{
      setSubmitButtonDisabled(false);
      console.log(res);
      if(DustbinID != null){
        navigate("/?Did="+DustbinID); 
      }
      else{
        navigate("/"); 
      }
      
    })
    .catch(err=> {
      setSubmitButtonDisabled(false);
      alert(err.message);
    })
  }


  return (
    <React.Fragment>
    <div className="close-btn-div">
    <Link to='/'><IoCloseCircleOutline className='close-btn'/></Link>
    </div>
    <div className="signup-box">
      <header className='signup-header'>Welcome back.</header>
      <div className="textfield-div">
      <input type="email" placeholder='Email address' className='textfield' value={values.email} onChange={(event) => setValues((prev) => ({...prev, email: event.target.value}))}/><br /><br />
      <input type="password" placeholder='Password' className='textfield' value={values.password} onChange={(event) => setValues((prev) => ({...prev, password: event.target.value}))}/><br /><br />
      <button className='signup-btn' onClick={handleSubmit} disabled={submitButtonDisabled}>Login</button><br />
      
      <div className="redirect-login"><p>Don't have an account?</p>&nbsp;<Link to={linkText} className='link'><p className='green'>Create one</p></Link></div>
      <div className="line-box">
      <div>
        <hr /></div>&nbsp; OR &nbsp;<div><hr /></div>
      </div><br />
      <button className="google-signin">
        <div className="gsignin-content">
        <FcGoogle className='gicon'/>&nbsp;
        <p>Sign in with Google</p>
        </div>
      </button>
      </div>
    </div>
  </React.Fragment>
  )
}

export default Login