import React, { useContext } from "react";
import './LoginPage.scoped.css';
import { appContext } from "../../Context";
import { IoIosLock } from "react-icons/io";

function LoginPage(props) {
    const {settings} = useContext(appContext);
    
    return (
        <div className="loginpage-container">
            <div className="UI-container">
                <div className="UI-top">
                    <IoIosLock size={64} className="icon"/>
                    <div className="UI-top-right">
                        <p className="heading">{settings.conference} {settings.committee}</p>
                        <p className="subheading">Digital Directive System</p>
                    </div>
                </div>

                <div className="UI-bottom">
                    <input type="text" id="keycode-input" placeholder="Enter Keycode" className="input-field" onKeyDown={(e) => {if (e.key === 'Enter') props.attemptLogin(e.target.value)}}></input>
                    <div className="btt-enter" onClick={() => props.attemptLogin(document.getElementById("keycode-input").value)}>Enter</div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
