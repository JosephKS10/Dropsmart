import React, {useEffect, useState} from 'react'
import './Home.css';
import { Link,useSearchParams, useNavigate} from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';
import { useAlert } from 'react-alert'
import { auth, database } from '../firebase';
import {ref, get, child } from "firebase/database";
import {useJsApiLoader, GoogleMap, Marker, InfoWindow} from "@react-google-maps/api"
import custommarker from '../pictures/delete.png'
import usermarker from '../pictures/location.png'
//images
import {TfiWallet} from "react-icons/tfi"
import {RiCopperCoinLine} from "react-icons/ri"
import {BiError} from "react-icons/bi";

//attribute

let center = {lat: 0, lng:0 }
let dusbtin1 = {lat: 12.9740033, lng:79.158051 }
let dusbtin2 = {lat: 12.974025464304212, lng:79.15847872010701 }
function Home() {

  




    const alert = useAlert();
    const navigate = useNavigate();
    const [getStartedTitle, setgetStartedTitle] = useState("Get started");
    const [getLink,setGetLink] = useState("/signup");
    const [getwalletStatus,setwalletStatus] = useState(false);
    const [getCoinAmount, setCoinAmount] = useState(0);
    const [getSearchDustbin,setSearchDustbin] = useState(false);
    const [getSearchDustbinbtn,setSearchDustbinbtn] = useState(true);
    const [getGeolocationStatus, setGeolocationStatus] = useState(false);
    const [padding, setPadding] = useState("0.8vh")
    
    // url parsing
    const [searchParams, setSearchParams] = useSearchParams();
    const [DustbinID, setDustbinID] = useState(searchParams.get('Did'));
    console.log(DustbinID+" DustbinID");
    
    //google map
    const[directionsResponse, setDirectionResponse] = useState(null)
    const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [selectedMarker, setselectedMarker] = useState(
    {
    name: "",
    location: {
      lat: "",
      lng: "",
    },
    status: false});

    async function get_details_dustbin(){
      const dbRef = ref(database);
      get(child(dbRef, `dustbins/${DustbinID}/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          navigate("/dustbin/?Did="+DustbinID);
        } else {
          alert.error("Invalid dustbin ID");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
    async function get_details_user_coins(String){
      const dbRef = ref(database);
      get(child(dbRef, `users/${String}/`))
      .then((snapshot) => {
          if (snapshot.exists()) {
            setCoinAmount(snapshot.val().home.coins);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
  }  

    // on successful user signup or login
    useEffect(() => {
      if(DustbinID != null){
        get_details_dustbin();  
      }

        auth.onAuthStateChanged((user)=>{
      if(user){
        setgetStartedTitle("View Profile");
        setGetLink("/profile");
        setwalletStatus(true);
        setPadding("2.2vh")
        get_details_user_coins(user.uid);
      }
      else{
          setgetStartedTitle("Get started");
          setGetLink("/signup");
          setwalletStatus(false);
          setPadding("0.7vh");
      }
      
    })

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, positionError);
      } else {
        alert.show('Geolocation is not supported by this device');
        
    }
    }
    function positionError() {
      alert.error('Geolocation is not enabled');
      setGeolocationStatus(true);
  }
    getLocation();
    function showPosition(position) {
     center.lat = position.coords.latitude;
     center.lng = position.coords.longitude;
     console.log(center.lat)
     console.log(center.lng)
    }

    }, [])

    
    const {isLoaded} = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    })

    if(!isLoaded){
      console.log(isLoaded)
    }
    else{
      console.log(isLoaded)
      
    }


  return (
    <React.Fragment>
        <header className='home-header'>
            <h1 className='ds-title'>DropSmart</h1>
            <div className='get-started-pos' style={{paddingRight: padding}}>
                <div className="wallet">
            {getwalletStatus && <TfiWallet className='wallet-icon'/>}
            {getwalletStatus && getCoinAmount}
            {getwalletStatus && <RiCopperCoinLine className='coin-icon'/>}
            </div>&nbsp;&nbsp;
            <Link to={getLink}><button className='get-started'>{getStartedTitle}</button></Link>
            </div>
        </header>
        <div className="homepage-body">

            <div className="locating_dustbin_div">
              {/* google map box */}
            {getSearchDustbin && isLoaded && 
            <GoogleMap center={center} zoom={20} mapContainerStyle={{width: "100vw", height: "50vh", zIndex: "3"}}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}>
                {/* displaying markers or directions */}
                <Marker position={center} options={{
                  icon:usermarker
                }}/>

                <Marker position={dusbtin1} options={{
                  icon:custommarker
                }}
                onClick={()=>{
                   let lat =  dusbtin1.lat;
                   let lat_text = lat.toString()
                   let lng = dusbtin1.lng
                   let lng_text = lng.toString()
                   let navigation_url = "https://www.google.com/maps/dir/?api=1&destination="+encodeURI(lat_text + "," + lng_text);
                   window.location.href = navigation_url
                  }}/>

                <Marker position={dusbtin2} options={{
                  icon:custommarker
                }}
                onClick={()=>{let lat =  dusbtin2.lat;
                  let lat_text = lat.toString()
                  let lng = dusbtin2.lng
                  let lng_text = lng.toString()
                  let navigation_url = "https://www.google.com/maps/dir/?api=1&destination="+encodeURI(lat_text + "," + lng_text);
                   window.location.href = navigation_url}}/>

            </GoogleMap>}
            
            {getSearchDustbinbtn && <button className='white-btn' onClick={()=> {setSearchDustbin(true);setSearchDustbinbtn(false)}} disabled={getGeolocationStatus}>{getGeolocationStatus && <BiError className='error-logo'/>}Dustbins near me</button>}

            </div>
            <div className="content-div">
            <TypeAnimation
      sequence={[
        'Welcome to the future of waste management! Our mission is to revolutionize the way we manage our waste, making it simple, efficient, and sustainable. Our innovative platform makes it easy for you to locate nearby dustbins, properly categorize your waste, and track your impact on the environment. With our rewards and incentives system, you\'ll be motivated to do your part in keeping our planet clean. Join the movement today and start making a difference!', // Types 'One'
        100
      ]}
      wrapper="div"
      cursor={false}
      repeat={Infinity}
      style={{ fontSize: '3vh', color:"#ffffff" }}
      className="content"
      speed={80}
        />
            </div>
        </div>
    </React.Fragment>
  )
}

export default Home