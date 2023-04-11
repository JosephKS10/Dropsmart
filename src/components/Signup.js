import React, {useState,useEffect} from 'react'
import "./Signup.css"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, database } from '../firebase';
import {ref, set } from "firebase/database";

//icons
import {IoCloseCircleOutline} from 'react-icons/io5'
import {FcGoogle} from "react-icons/fc"


function Signup() {
  const navigate = useNavigate();
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
      setlinkText("/login/?Did="+DustbinID); 
    }
    else{
      setlinkText("/login");
    }
  }, [DustbinID])
  const handleSubmit = () => {
    if(!values.email || !values.password){
      alert("Please fill all the fields");
      return;
    }
    setSubmitButtonDisabled(true);
    let array = values.email.split("@");
    let name = array[0];
    createUserWithEmailAndPassword(auth,values.email,values.password).then(async res=>{
      setSubmitButtonDisabled(false);
      console.log(res);
      const user = res.user;
      await updateProfile(user,{
        displayName:name
      });
      
      set(ref(database, 'users/' + user.uid +'/home/'), {
        scans: 0,
        coins: 0,
        last_date_coin_recieved: "YYYY-MM-DD",
        level: 1,
      });
      set(ref(database, 'users/' + user.uid +'/shop/'), {
        total_purchases: 0,
      });
      set(ref(database, 'users/' + user.uid +'/about/'), {
        username: user.displayName,
        email: user.email,
      });
      
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
        <header className='signup-header'>Join DropSmart.</header>
        <div className="textfield-div">
        <input type="email" placeholder='Email address' className='textfield' value={values.email} onChange={(event) => setValues((prev) => ({...prev, email: event.target.value}))}/><br /><br />
        <input type="password" placeholder='Password' className='textfield' value={values.password} onChange={(event) => setValues((prev) => ({...prev, password: event.target.value}))}/><br /><br />
        <button className='signup-btn' onClick={handleSubmit} disabled={submitButtonDisabled}>Signup</button><br />
        
        <div className="redirect-login"><p>Already have an account?</p>&nbsp;<Link to={linkText} className='link'><p className='green'>Sign in</p></Link></div>
        <div className="line-box">
        <div>
          <hr /></div>&nbsp; OR &nbsp;<div><hr /></div>
        </div><br />
        <button className="google-signin">
          <div className="gsignin-content">
          <FcGoogle className='gicon'/>&nbsp;
          <p>Sign up with Google</p>
          </div>
        </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Signup