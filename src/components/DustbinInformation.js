import React,{useState} from 'react'
import "./DustbinInformation.css"
import  Chart  from "react-apexcharts";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useAlert } from 'react-alert'
function DustbinInformation(props) {

    // Modal variables
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const alert = useAlert();

    const [dustbinInfo, setDustbinInfo] = useState(props.dustbinInfo);
    let b,n,h,e,o;
    if(dustbinInfo.biogradeable == 0){
        b = 0;
    }
    else{
        b = ((dustbinInfo.biogradeable/dustbinInfo.total_waste)*100).toFixed(1)
    }
    if(dustbinInfo.nonbiogradeable == 0){
        n = 0;
    }
    else{
        n = ((dustbinInfo.nonbiogradeable/dustbinInfo.total_waste)*100).toFixed(1)
    }
    if(dustbinInfo.hazardous == 0){
        h = 0;
    }
    else{
        h = ((dustbinInfo.hazardous/dustbinInfo.total_waste)*100).toFixed(1)
    }
    if(dustbinInfo.electronic == 0){
        e = 0;
    }
    else{
        e = ((dustbinInfo.electronic/dustbinInfo.total_waste)*100).toFixed(1)
    }
    if(dustbinInfo.others == 0){
        o = 0;
    }
    else{
        o =((dustbinInfo.others/dustbinInfo.total_waste)*100).toFixed(1)
    }

  return (
    <React.Fragment>
      
        <header className='information-header'>
            <b><p className='information-title'>Behind the Lid: An Inside Look at Your Daily Discards</p></b>
            <div className="btn-back">
      <button className='info-btn-back' onClick={()=>{props.state(false);props.infostate(true);}}>Go back</button>
      </div>
        </header>
        <div className="chart-box">
        <Chart className="chart"
                type="pie"
                // width={300}
                // height={800}
                series={[dustbinInfo.biogradeable,dustbinInfo.nonbiogradeable,
                  dustbinInfo.hazardous,dustbinInfo.electronic,dustbinInfo.others]}     
                            
                options={{
                    height: 180,
                    width: 300,
                    dataLabels: {
                         enabled: true,
                         style: {
                           fontSize: "1.2vh",
                           fontFamily: "Work Sans, sans-serif",
                           fontWeight: "bold",
                         }
                       },plotOptions: {
                        pie: {
                          dataLabels: {
                            offset: -10,
                          }, 
                        }
                      },
                       legend: {
                        fontSize: "8vh",
                        labels: {
                            colors: "black",
                            fontFamily: "Work Sans, sans-serif",
                            fontWeight: "bold"
                        }
                      
                      },
                    labels:["Biodegradable","Non-Biodegradable", "Hazardous", "Electronic","Others"]                  

                 }}
                
                />
                </div>
                <div className="chart-info">
                 <b><p className='p'>Insights on</p></b> 
                <table className='table'>
                  <tbody>
                  <tr>
                    <td>Biodegradable-{b}%</td>
                    <td><div className="space"><button className='get-info-btn' onClick={()=>{setOpen1(true);}}>Get info</button></div></td>
                    {open1 && <Modal open={open1} onClose={()=>{setOpen1(false)}} center>
                      <p>Biodegradable waste refers to organic waste that can decompose naturally in the 
                        environment. Examples of biodegradable waste include food scraps, 
                        yard waste, and some paper products. Proper disposal of biodegradable 
                        waste is important for the environment as it can reduce greenhouse gas 
                        emissions and minimize the amount of waste that goes to landfills.</p>
                    </Modal>}
                  </tr>
                  <tr>
                    <td>Non-Biodegradable-{n}%</td>
                    <td><div className="space"><button className='get-info-btn' onClick={()=>{setOpen2(true)}}>Get info</button></div></td>
                    {open2 && <Modal open={open2} onClose={()=>{setOpen2(false)}} center>
                      <p>Non-biodegradable waste refers to materials that cannot decompose naturally in the environment. 
                        Examples of non-biodegradable waste include plastics, metals, and glass. Proper disposal of 
                        non-biodegradable waste is important for the environment as it can prevent pollution and reduce 
                        the negative impacts on natural resources.</p>
                    </Modal>}
                  </tr>
                  <tr>
                    <td>Hazardous-{h}%</td>
                    <td><div className="space"><button className='get-info-btn' onClick={()=>{setOpen3(true)}}>Get info</button></div></td>
                    {open3 && <Modal open={open3} onClose={()=>{setOpen3(false)}} center>
                      <p>Hazardous waste refers to waste materials that can pose a risk to human health or the environment 
                        if not disposed of properly. Examples of hazardous waste include chemicals, batteries, Medical waste, 
                        oil, and oil filters. Proper disposal of hazardous waste is important to prevent harm to people and the environment.</p>
                    </Modal>}
                  </tr>
                  <tr>
                    <td>Electronic-{e}%</td>
                    <td><div className="space"><button className='get-info-btn' onClick={()=>{setOpen4(true)}}>Get info</button></div></td>
                    {open4 && <Modal open={open4} onClose={()=>{setOpen4(false)}} center>
                      <p>Electronic waste, also known as e-waste, is any discarded electronic device or component, such as mobile phones, 
                        laptops, computers, televisions, and other similar items. Due to the harmful components and materials present in
                         electronic devices, they should not be disposed of in the regular trash.</p>
                    </Modal>}
                  </tr>
                  <tr>
                    <td>Others-{o}%</td>
                  </tr>
                  <tr>
                    <td>Total waste inside-{dustbinInfo.total_waste}</td>
                    <td><div className="space"><button className='report-btn' onClick={()=>{alert.success("The report has been sent to the authorities");}}>Dustbin Full</button></div></td>
                  </tr>
                  </tbody>
                </table>
                </div>
    </React.Fragment>

  )
}

export default DustbinInformation