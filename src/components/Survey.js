import React, {useState,useEffect} from 'react'
import './Survey.css'
import { auth, database } from '../firebase';
import {ref, set, update, get, child } from "firebase/database";
import { useAlert } from 'react-alert'


function Survey(props) {
    let questions = ["Is the waste organic in nature?",
    "Can the waste be broken down naturally by microorganisms like bacteria or fungi?",
    "Does the waste contain any electronic components or devices?",
    "Does the waste contain any toxic or harmful chemicals or substances?"];
    const alert = useAlert();
    const [getAnswer,setAnswer] = useState("");
    const [getType, setType] = useState("");
    const [getType_status, setType_status] = useState(false);
    const [getQuestion_status, setQuestion_status] = useState(true);
    const [gobacktext,setgobacktext] = useState("Cancel Survey");
    const [check,setcheck] = useState(0);
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
        // getting data from cloud and setting userInfo
        if(getType_status && l && j){
            setgobacktext("Go back")
            get_details_user()
            get_details_dustbin();
            // console.log(1); 
        }
        if(!l && !j){
            setget_status(true);
        }

        // updating the userinfo state 
        if(get_status && m && n){
            // console.log(2)
            // console.log(dustbinInfo);
            // console.log(userInfo);
            survey_complete_user();
            survey_complete_dustbin();
        }
        if(!m && !n){
            setfinal_status(true) 
        }

        // updating the data to cloud
        if(final_status){
            // console.log(3);
            // console.log(userInfo)
            // console.log(dustbinInfo)
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
    
        if(check == 0){
            if(getAnswer === "Yes"){
                setcheck(1);
                setAnswer("");
            }
            else if(getAnswer === "No"){
                setcheck(2);
                setAnswer("");
            }
        }
        if(check == 1){
            if(getAnswer === "Yes"){
                setType("Biodegradable");
                setType_status(true);
                setQuestion_status(false);
                setAnswer("");
            }
            else if(getAnswer === "No"){
                setType("Non-Biodegradable");
                setType_status(true);
                setQuestion_status(false);
                setAnswer("");
            }
        }
        if(check === 2){
            if(getAnswer == "Yes"){
                setType("Electronic");
                setType_status(true);
                setQuestion_status(false);
                setAnswer("");
            }
            else if(getAnswer === "No"){
                setcheck(3);
                setAnswer("");
            }
        }
        if(check === 3){
            if(getAnswer == "Yes"){
                setType("Hazardous");
                setType_status(true);
                setQuestion_status(false);
                setAnswer("");
            }
            else if(getAnswer === "No"){
                setType("Others");
                setType_status(true);
                setQuestion_status(false);
                setAnswer("");
            }
        }
        // console.log(getAnswer)
        // console.log(check)
    }, [getAnswer,getType_status,get_status,l,j,m,n,final_status])
    
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
       
        <header className='survey-header'>
            <b><p className='survey-title'>Survey</p></b>
            <button className='cancel-survey' onClick={()=>{props.state(false);props.infostate(true);}}>{gobacktext}</button>
        </header>
        {getQuestion_status && <div>
        <div className="question-part">
            <p>{questions[check]}</p>
        </div>
        <div className="answer-part">
        <button className='answer-btn' onClick={()=>{setAnswer("Yes")}}>Yes</button><br /><br />
        <button className='answer-btn'onClick={()=>{setAnswer("No")}}>No</button><br /><br />
        </div>
        </div>}
        {getType_status && <div className='question-part down'>
            <p><b>Your waste belongs to {getType} category</b></p>
            </div>}

    </React.Fragment>
  )
}

export default Survey