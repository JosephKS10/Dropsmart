import React, {useState,useEffect} from 'react'
import { Link,useSearchParams, useNavigate} from 'react-router-dom'
import './DustbinUI.css'
import Survey from './Survey'
import ScanUI from './ScanUI'
import DustbinInformation from './DustbinInformation'
import { useAlert } from 'react-alert'
import { auth, database } from '../firebase';
import {ref, set, child, get } from "firebase/database";
// icons
import {ImBin2} from 'react-icons/im'

function DustbinUI() {
    // getting the dustbin ID from the url
    const [searchParams, setSearchParams] = useSearchParams();
    const [DustbinID, setDustbinID] = useState(searchParams.get('Did'));
    console.log(DustbinID+" DustbinID");

    // for survey
    const [SurveyState, setSurveyState] = useState(false);
    const [InformationState, setInformationState] = useState(false);
    const [dustbininfo_status, setDustbinInfo_status] = useState(false);
    const [data_update, setdata_update] = useState(false);
    const [webcamstatus, setwebcamstatus] = useState(false);
    //for dustbin info body
    const [getInfoBody, setInfoBody] = useState(true);

    // user
    const [user, setuser] = useState({});
    const [dustbinInfo, setDustbinInfo] = useState({biogradeable:0,
        electronic: 0,
        hazardous:0,
        nonbiogradeable:0,
        others: 0,
        total_waste: 0});

    const alert = useAlert();
    const navigate = useNavigate();


    useEffect(() => {
        auth.onAuthStateChanged((user)=>{
            if(user){
                setuser(user);
                get_details_dustbin()
            }
            else{
                alert.show("Please Login\/Signup and then proceed");
                navigate("/login/?Did="+DustbinID);
          }
          })

          if(data_update){
            get_details_dustbin()
            setdata_update(false);
          }
         
    }, [user,data_update])

    async function get_details_dustbin(){
        const dbRef = ref(database);
        get(child(dbRef, `dustbins/${DustbinID}/`))
        .then((snapshot) => {
          if (snapshot.exists()) {
              setDustbinInfo(snapshot.val());
              setDustbinInfo_status(true);
          } else {
            console.log("error")
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }

  return (
    <React.Fragment>
        <header className="dustbin-header">
        <h1 className='dustbin-title'>DropSmart</h1>
            <div className="go-back-div">
            <Link to='/'><button className='get-started'>Go Home</button></Link>
            </div>
        </header>
        <div className="dustbin-body">
            <div className="dustbin-info-box">
                <header className='info-header'>
                    <div><ImBin2 className='icon'/></div>&nbsp;
                    <p className='icon-info'><b>Dustbin #{DustbinID}</b></p>
                </header>
                {getInfoBody && <div className="info-body">
                    <p className='text'>Tell us about your waste</p>
                    <div className="button-box">
                    <button className='dustbin-btn' onClick={()=>{setwebcamstatus(true);setInfoBody(false)}}>Scan your waste</button><br /><br />
                    <div className="line-box">
                    <div>
                    <hr /></div>&nbsp; OR &nbsp;<div><hr /></div>
                    </div><br />
                    <button className='dustbin-btn' onClick={()=>{setSurveyState(true);setInfoBody(false)}}>Take a survey</button>
                    </div>
                   <div className="info-div">
                   <p className='text'>Wanna know what's inside</p>
                    <div className="get-info-btn-box">
                    <button className='dustbin-btn up' onClick={()=>{setInformationState(true);setInfoBody(false)}}>Get information</button>
                    </div>
                   </div>
                </div>}
                {webcamstatus && <ScanUI  state={webcamstatus => setwebcamstatus(webcamstatus)} 
                    infostate={getInfoBody => setInfoBody(getInfoBody)}
                    data_update={data_update => setdata_update(data_update)}  
                    useruid={user.uid}
                    dustbinid={DustbinID}/>}

                {SurveyState && <Survey state={SurveyState => setSurveyState(SurveyState)} 
                infostate={getInfoBody => setInfoBody(getInfoBody)}
                data_update={data_update => setdata_update(data_update)}  
                useruid={user.uid}
                dustbinid={DustbinID}/>}

                {InformationState && dustbininfo_status && <DustbinInformation dustbinInfo={dustbinInfo}
                infostate={getInfoBody => setInfoBody(getInfoBody)}
                state={InformationState => setInformationState(InformationState)}/>}
            </div>
        </div>
    </React.Fragment>
  )
}

export default DustbinUI