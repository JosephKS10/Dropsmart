import React, {useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Profile.css"
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebase';
import {ref, set, update, get, child } from "firebase/database";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

//icons and images
import Logo from "../pictures/ds_logo.svg"
import {TfiWallet} from "react-icons/tfi"
import {RiCopperCoinLine} from "react-icons/ri"
import {IoMdNotificationsOutline,IoMdNotifications} from "react-icons/io"
import {CgProfile} from "react-icons/cg"
import {BiLogOut, BiPurchaseTag, BiEdit, BiSave} from "react-icons/bi"
import {IoMdQrScanner} from "react-icons/io"
import {SlBadge} from "react-icons/sl"
function Profile() {
    const navigate = useNavigate();
    const [submitLogoutButtonDisabled, setLogoutButtonDisabled] = useState(false);
    const [useruid, setuserUid] = useState("");
    const [userInfo, setuserInfo] = useState({
      about:{
        email:"",
        username:""
      },
      home:{
        coins:"",
        last_date_coin_recieved:"",
        level:"",
        scans:"",
      },
      shop:{
        total_purchases: ""
      }
    })
    const [values, setValues] = useState({
      email:"",
      username:""
    })
    const [valuesdisabled,setvaluesDisabled] = useState({
      username: true,
      email: true
    })

    // get details of the user
    async function get_details_user(String){
      const dbRef = ref(database);
      get(child(dbRef, `users/${String}/`))
      .then((snapshot) => {
          if (snapshot.exists()) {
            setuserInfo(snapshot.val());
            setValues(snapshot.val().about)
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
  }  

    function capitalize(sample){
      let Capital_letter=sample.charAt(0).toUpperCase();
      let Capital_string=Capital_letter+sample.slice(1);
      return Capital_string
    }

    useEffect(() => {
      auth.onAuthStateChanged((user)=>{
    if(user){
      setuserUid({useruid:user.uid});
      get_details_user(user.uid);
    }

  })
  }, [])

    const Logout = () => {
        setLogoutButtonDisabled(true);
        signOut(auth).then(() => {
            // Sign-out successful.
            setLogoutButtonDisabled(false);
            navigate("/");

          }).catch((error) => {
            setLogoutButtonDisabled(false);
          });
    }


  return (
    <React.Fragment>
      <header className='home-header'>
             <h1 className='ds-title'>DropSmart</h1>
            <div className='back-container'>
                {/* <div className="wallet">
            
            {getwalletStatus && getCoinAmount}
            {getwalletStatus && <RiCopperCoinLine className='coin-icon'/>}
            </div>&nbsp;&nbsp; */}
            <IoMdNotificationsOutline className='bell-icon'/>
            <Link to="/"><button className='profile-back'>Go back</button></Link>
            </div>
        </header>
        <div className="profile-content">
          <div className="content-header">
            <div className="content1">
            <CgProfile className='profile-icon'/>
            <p className='name'>{capitalize(userInfo.about.username)}</p>
            </div>
            <div className="content2">
            <button className='signout-btn' onClick={Logout} disabled={submitLogoutButtonDisabled}><BiLogOut /></button>
            </div>
          </div>
          <Tabs className="tabs">
              <TabList>
                <Tab>Home</Tab>
                <Tab>Store</Tab>
                <Tab>About</Tab>
              </TabList>

              <TabPanel>
                <h2>Activity center</h2>
                <div className="tile">
                <div className='tile-head'>
                <IoMdQrScanner className='home-icon'/>
                    <p className='tile-heading'>Successful scans</p>
                </div>
                    <div className='tile-answer'>{userInfo.home.scans}</div>
                </div><br />
                <div className="tile">
                <div className='tile-head'>
                <TfiWallet className='home-icon'/>
                  <p>Wallet balance</p>
                </div>
                  <div className='tile-answer'>{userInfo.home.coins}</div>
                </div><br />
                <div className="tile">
                <div className='tile-head'>
                <SlBadge className='home-icon'/>
                    <p>User Level</p>
                </div>
                    <div className='tile-answer'>{userInfo.home.level}</div>
                </div><br />
                <div className="tile">
                <div className='tile-head'>
                    <BiPurchaseTag className='home-icon'/>
                    <p>Purchases</p>
                    </div>
                    <div className='tile-answer'>{userInfo.shop.total_purchases}</div>
                </div>
              </TabPanel>

              <TabPanel>
                <h2>The Store</h2>
                <div className="tile">
                  <div className="logo-company1"></div>
                  <div className='shop-side-tile'>
                    <p className='shop-head'>Uber Eats Giftcard</p>
                    <p className='shop-content'>flat 50% off at purchase of Rs500</p>
                    <div className="button-shop"><button className='buy-button'>Buy for 50<RiCopperCoinLine className='shop-coin-icon'/></button></div>
                    </div>
                </div><br />
                <div className="tile">
                  <div className="logo-company2"></div>
                  <div className='shop-side-tile'>
                    <p className='shop-head'>Amazon Giftcard</p>
                    <p className='shop-content'>flat 50% off at purchase of Rs500</p>
                    <div className="button-shop"><button className='buy-button'>Buy for 50<RiCopperCoinLine className='shop-coin-icon'/></button></div>
                    </div>
                </div><br />
                <div className="tile">
                <div className="logo-company3"></div>
                <div className='shop-side-tile'>
                    <p className='shop-head'>Google Play Giftcard</p>
                    <p className='shop-content'>flat 50% off at purchase of Rs500</p>
                    <div className="button-shop"><button className='buy-button'>Buy for 50<RiCopperCoinLine className='shop-coin-icon'/></button></div>
                    </div>
                </div><br />
                <div className="tile">
                <div className="logo-company4"></div>
                  <div className='shop-side-tile'>
                    <p className='shop-head'>Flipcart Giftcard</p>
                    <p className='shop-content'>flat 50% off at purchase of Rs500</p>
                    <div className="button-shop"><button className='buy-button'>Buy for 50<RiCopperCoinLine className='shop-coin-icon'/></button></div>
                    </div>
                </div><br />
              </TabPanel>
              <TabPanel>
                <h2> Edit profile details</h2>
                
                  <fieldset>
                    <legend>Email</legend>
                    <div className='edittext-div'>
                    <input type="text" className='text-field' disabled={valuesdisabled.email} value={values.email} onChange={(event) => setValues((prev) => ({...prev, email: event.target.value}))}/>
                    {valuesdisabled.email && <button className='edit' onClick={()=>{setvaluesDisabled({username: true,
                      email: false})}}><BiEdit className='edit-icon'/></button>}
                    {valuesdisabled.email || <button className='edit' onClick={()=>{setvaluesDisabled({username: true,
                      email: true})}}><BiSave className='edit-icon'/></button>} 
                    </div>
                  </fieldset>
                  <br />
                  <fieldset>
                    <legend>Username</legend>
                    <div className='edittext-div'>
                    <input type="text" className='text-field' disabled={valuesdisabled.username} value={values.username} onChange={(event) => setValues((prev) => ({...prev, username: event.target.value}))}/>
                    {valuesdisabled.username && <button className='edit' onClick={()=>{setvaluesDisabled({username: false,
                      email: true})}}><BiEdit className='edit-icon'/></button>}
                    {valuesdisabled.username || <button className='edit' onClick={()=>{setvaluesDisabled({username: true,
                      email: true})}}><BiSave className='edit-icon'/></button>}
                    </div>
                  </fieldset>
              </TabPanel>
          </Tabs>
        </div>
    </React.Fragment>
  )
}

export default Profile