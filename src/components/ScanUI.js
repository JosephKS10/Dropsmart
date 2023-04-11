import React,{useState,useRef,useEffect} from 'react'
import './ScanUI.css'
import Webcam from 'react-webcam';
import * as tmImage from '@teachablemachine/image';
import { auth, database } from '../firebase';
import {ref, set, update, get, child } from "firebase/database";
import { useAlert } from 'react-alert'

function ScanUI(props) {
    const videoConstraints = {
        width: 780,
        height: 780,
        facingMode: "environment"
      };
      const alert = useAlert();
      const [model, setModel] = useState(null);
      const [prediction, setPrediction] = useState(null);
      const [predictionStatus, setPredictionStatus] = useState(null);
      const [revealStatus, setRevealStatus] = useState(null);
      const webcamRef = useRef(null);

      const [getType, setType] = useState("");
      const [getType_status, setType_status] = useState(false);
      const [coin_check, setCoin_Check] = useState(false);
      const [userInfo, setUserInfo] = useState({coins:0,
          last_date_coin_recieved: "YYYY-MM-DD",
          level: 0,
          scans: 0});
      const [dustbinInfo, setDustbinInfo] = useState({biogradeable:0,
          electronic: 0,
          hazardous:0,
          nonbiogradeable:0,
          others: 0,
          total_waste: 0});

        const [get_status,setget_status] = useState(false);
        const [final_status,setfinal_status] = useState(false)
        // for first condition 
        const [j,setj] = useState(true)
        const [l,setl] = useState(true);
        // second condition
        const [m,setm] = useState(true); 
        const [n,setn] = useState(true); 



      useEffect(() => {
        const loadModel = async () => {
          const URL = 'https://teachablemachine.withgoogle.com/models/LGsZgi7T8/';
          const modelURL = `${URL}model.json`;
          const metadataURL = `${URL}metadata.json`;
    
          const model = await tmImage.load(modelURL, metadataURL);
          setModel(model);
        };
    
        if(predictionStatus){
            let probability_nb = prediction[0].probability
            let probability_b = prediction[1].probability
            let probability_e = prediction[2].probability
            if(probability_nb>probability_b && probability_nb>probability_e){
                setType("Non-Biodegradable")
                setType_status(true);
            }
            else if(probability_b>probability_nb && probability_b>probability_e){
                setType("Biodegradable")
                setType_status(true);
            }
            else{
                setType("Electronic")
                setType_status(true);
            }
        }

        loadModel();

        // getting data from cloud and setting userInfo
        if(getType_status && l && j){
            get_details_user()
            get_details_dustbin();
            console.log(1); 
        }
        if(!l && !j){
            setget_status(true);
        }

        // updating the userinfo state 
        if(get_status && m && n){
            console.log(2)
            console.log(dustbinInfo);
            console.log(userInfo);
            survey_complete_user();
            survey_complete_dustbin();
        }
        if(!m && !n){
            setfinal_status(true) 
        }

        if(final_status){
            console.log(3);
            console.log(userInfo)
            console.log(dustbinInfo)
            let promise1 = update_user_data();
            promise1.then(()=>{console.log("user's data has been updated")})
            let promise2 = update_dustbin_data();
            promise2.then(()=>{console.log("dustbin's data has been updated")})
            if(coin_check){
                alert.success("Data sent successfully. Here is your reward: 1 coin recieved");
                props.data_update(true);
            }
            else{
                alert.success("Data sent successfully")
                props.data_update(true);
            }
        }

      }, [predictionStatus,getType_status,get_status,l,j,m,n,final_status]);

      console.log(prediction);
      console.log(predictionStatus)
      const predict = async (img, model) => {
        const prediction = await model.predict(img);
        setPrediction(prediction);
        setPredictionStatus(true);
      };
    

      const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const img = document.createElement('img');
        img.onload = async () => {
          predict(img, model);
        };
        img.src = imageSrc;
      };

  if (model == null) {
    return <div>Loading model...</div>;
  }

  // get_details of user
  async function get_details_user(){
    const dbRef = ref(database);
    get(child(dbRef, `users/${props.useruid}/home/`))
    .then((snapshot) => {
        if (snapshot.exists()) {
          setUserInfo(snapshot.val());
          setl(false);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
}  
    //get details about the dustbin
    async function get_details_dustbin(){
        const dbRef = ref(database);
        get(child(dbRef, `dustbins/${props.dustbinid}/`))
        .then((snapshot) => {
        if (snapshot.exists()) {
            setDustbinInfo(snapshot.val())
            setj(false);
        } else {
            console.log("error")
        }
        })
        .catch((error) => {
        console.error(error);
        });
    }

    // update info about the user
    function survey_complete_user(){
        let scans = userInfo.scans+1;
        let coins = userInfo.coins;
        let level = userInfo.level
        let Currentdate = new Date();
        let date_update = new Date();
        // for checking 24 hour condition
        if(userInfo.last_date_coin_recieved === "YYYY-MM-DD"){
            coins=1;
            setCoin_Check(true);
        }
        else{
            let date = new Date(userInfo.last_date_coin_recieved);
            let timeDiff = Currentdate.getTime() - date.getTime();
            let hoursDiff = timeDiff / (1000 * 60 * 60);
            if (hoursDiff >= 24) {
                coins++;
                date_update = Currentdate; 
                setCoin_Check(true);
                // console.log("coin added")
            }
            else{
                date_update = date;
                setCoin_Check(false);
                // console.log("coin not added")
            }
        }
        // for checking level condition
        if(scans%10 == 0){
            level++;
        }
        setUserInfo({coins:coins,
            last_date_coin_recieved: date_update,
            level: level,
            scans: scans});
        setm(false);
    }  

    function survey_complete_dustbin(){
        let biogradeable = dustbinInfo.biogradeable;
        let electronic = dustbinInfo.electronic;
        let hazardous = dustbinInfo.hazardous;
        let nonbiogradeable = dustbinInfo.nonbiogradeable;
        let others = dustbinInfo.others;
        let total_waste = dustbinInfo.total_waste+1;
        if(getType == "Biodegradable"){
            biogradeable++;
        }
        else if(getType == "Electronic"){
            electronic++;
        }
        else if(getType == "Non-Biodegradable"){
            nonbiogradeable++;
        }
        else if(getType == "Hazardous"){
            hazardous++;
        }
        else if(getType == "Others"){
            others++;
        }

        setDustbinInfo({biogradeable:biogradeable,
            electronic: electronic,
            hazardous:hazardous,
            nonbiogradeable:nonbiogradeable,
            others: others,
            total_waste: total_waste})
        setn(false)
    }

    // update data of user in the cloud
    async function update_user_data(){
        const updates = {};    
        updates['users/' + props.useruid +'/home/'] = userInfo;
        return update(ref(database), updates);
    }
    async function update_dustbin_data(){
        const updates = {};    
        updates['dustbins/' + props.dustbinid] = dustbinInfo;
        return update(ref(database), updates);
    }  

  return (
      <React.Fragment>
         <header className='scan-header'>
            <b><p className='scan-title'>Scan Waste</p></b>
            <button className='cancel-scan' onClick={()=>{props.state(false);props.infostate(true);}}>Go back</button>
        </header>
        {predictionStatus || <div className="scan_body">
            <div className="scanner">
        <Webcam
    audio={false}
    height={310}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={310}
    videoConstraints={videoConstraints}
    className="webcam"/>
    
            <div className='capture-btn-div'>
        <button onClick={capture} className='capture-btn'>Capture photo</button>
            </div>
        </div>
    </div>}
        {predictionStatus && getType_status && <div className='question-part down'>
            <p><b>Your waste belongs to {getType} category</b></p>
            </div>}
      </React.Fragment>
  )
}

export default ScanUI