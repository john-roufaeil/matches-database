import axios, * as others from 'axios';
import '../App.css'; 
import FadeIn from 'react-fade-in';
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';
import exc from "../assets/gifs/exclamation.gif"


const Form = props => { 
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [clubName, setClubName] = useState("");
    const [stadiumName, setStadiumName] = useState("");
    const [users, setUsers] = useState([]);
    const [stadiumManagers, setStadiumManagers] = useState([]);
    const [clubRepresentatives, setClubRepresentatives] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/viewStadiums')
        .then(res => setStadiums(res.data))
    }, [stadiums]);

    const [clubs, setClubs] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/viewClubs')
        .then(res => setClubs(res.data))
    }, [clubs]);
    
    const [errMsg, setErrMsg] = useState("");
    const errorRef = useRef();

    const [successMsg, setSuccessMsg] = useState("");
    const successRef = useRef();

    useEffect(() => {
        setSuccessMsg("") 
        setErrMsg("")
    }, [props.type])

    const {loggedInUser, setLoggedInUser} = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:5000/getUsers').then(res => setUsers(res.data))
        axios.get('http://localhost:5000/getStadiumManagers').then(res => setStadiumManagers(res.data))
        axios.get('http://localhost:5000/getClubRepresentatives').then(res => setClubRepresentatives(res.data))
    }, []);

    const getIsFormValid = type => {
        if (!(username && password))
            return false;
        switch(type) {
            case "stadiumManager": return name&&stadiumName?true:false;
            case "clubRepresentative": return name&&clubName?true:false;
            case "fan": return name&&nationalId?true:false; 
            default: return true;
        }
    };

    const clearForm = () => { 
        setName(""); 
        setUsername(""); 
        setPassword(""); 
        setNationalId(""); 
        setBirthDate(""); 
        setAddress("");
        setPhone("");  
        setClubName(""); 
        setStadiumName(""); 
    }; 

    const submitNewF = async (e) => {
        e.preventDefault(); 
        var exisitingUsername = false;
        users.forEach(user => {
            if (user.username == username) {
                exisitingUsername = true;
            }
        });
        if (exisitingUsername) setErrMsg("This username is unavailable")
        else {
            const newData = await fetch('http://localhost:5000/newF', {
                method: 'POST', 
                url: 'http://localhost:5000',
                header : {
                    'Content-Type': 'application/json',  
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: {name}.name,
                    username: {username}.username,
                    password: {password}.password,
                    nat_id: {nationalId}.nationalId,
                    birthdate: {birthDate}.birthDate.replaceAll('-', ''),
                    address: {address}.address,
                    phone: {phone}.phone
                })
            })
            .then(res => console.log(res.json()))
            .then(clearForm())
            .then(setSuccessMsg("You have successfully registered."))
        }
    };
    
    const fanForm = () => {
        return  <FadeIn>
                    <p ref={successRef} className={successMsg ? "successMsg" : "offscreen"}>{successMsg}</p>
                    <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>{errMsg}</p>
                    <form  method="POST" action="/newF" className="fanForm" onSubmit={submitNewF}> 
                        <div className="field">
                            <label htmlFor="name">
                                Name
                            </label><br />
                            <input
                                type = "text"
                                id = "name" 
                                name = "name"
                                value = {name}
                                onChange={(e) => {setName(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="username">
                                Username
                            </label><br />
                            <input
                                type= "text"
                                id = "username" 
                                name = "username"
                                value = {username}
                                onChange={(e) => {setUsername(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">
                                Password
                            </label><br />
                            <input
                                type="password"
                                id = "password" 
                                name = "password"
                                value = {password}
                                onChange={(e) => {setPassword(e.target.value)}}
                                required
                                autoComplete='new-password'
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="nationalId">
                                National ID Number 
                            </label><br />
                            <input
                                type= "text"
                                id = "nationalId" 
                                name = "nationalId"
                                onChange={(e) => {setNationalId(e.target.value)}}
                                value = {nationalId}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="birthDate">
                                Date of Birth
                            </label><br />
                            <input
                                type= "date"
                                id = "birthDate" 
                                name = "birthDate"
                                value = {birthDate}
                                onChange={(e) => {setBirthDate(e.target.value)}}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="address">
                                Address
                            </label><br />
                            <input
                                type= "location"
                                id = "address" 
                                name = "address"
                                value = {address}
                                onChange={(e) => {setAddress(e.target.value)}}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">
                                Phone Number
                            </label><br />
                            <input
                                type= "tel"
                                id = "phone" 
                                name = "phone"
                                value = {phone}
                                onChange={(e) => {setPhone(e.target.value)}}
                            />
                        </div>
                        <button type="submit" disabled={!getIsFormValid("fan")}> 
                            Create account 
                        </button>  
                    </form>
                </FadeIn>
    };

    const submitNewSAM = async (e) => {
        e.preventDefault(); 
        var exisitingUsername = false;
        users.forEach(user => {
            if (user.username == username) {
                exisitingUsername = true;
            }
        });
        if (exisitingUsername) setErrMsg("This username is unavailable")
        else {
            const newData = await fetch('http://localhost:5000/newSAM', {
                method: 'POST', 
                url: 'http://localhost:5000',
                header : {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: {name}.name,
                    username: {username}.username,
                    password: {password}.password
                })
            })
            .then(res => console.log(res.json()))
            .then(clearForm())
            .then(setSuccessMsg("You have successfully registered."))
        }
    };
    const managerForm = () => {
        return <FadeIn>
                    <p ref={successRef} className={successMsg ? "successMsg" : "offscreen"}>{successMsg}</p>
                    <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>{errMsg}</p>
                    <form method="POST" action="/newSAM" className="managerForm" onSubmit={submitNewSAM}> 
                        <div className="field">
                            <label htmlFor="name">
                                Name 
                            </label><br />
                            <input
                                type="text"
                                id ="name" 
                                name = "name"
                                value = {name}
                                onChange={(e) => {setName(e.target.value);}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="username">
                                Username 
                            </label><br />
                            <input
                                type="text"
                                id ="username" 
                                name="username"
                                value = {username}
                                onChange={(e) => {setUsername(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">
                                Password 
                            </label><br />
                            <input
                                required
                                value = {password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                name="password"
                                id ="password" 
                                type="password"
                                autoComplete='new-password'
                            />
                        </div>
                        <button type="submit" disabled={!getIsFormValid("manager")}> 
                            Create account 
                        </button>  
                    </form>
                </FadeIn>
    };
   
    const submitNewCR = async (e) => {
        e.preventDefault(); 
        var exisitingUsername = false;
        var takenClub = false;
        var invalidClub = true;
        users.forEach(user => {
            if (user.username == username) {
                exisitingUsername = true;
            }
        });
        clubRepresentatives.forEach(rep => {
            if (rep.name == clubName) {
                takenClub = true;
            }
        });
        clubs.forEach(club => {
            if (club.name == clubName) {
                invalidClub = false;
            }
        });
        if (exisitingUsername) setErrMsg("This username is unavailable")
        else if (takenClub) setErrMsg("This club already has a representative")
        else if (invalidClub) setErrMsg("This club does not exist")
        else {
            const newData = await fetch('http://localhost:5000/newCR', {
                method: 'POST', 
                url: 'http://localhost:5000',
                header : {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: {name}.name,
                    username: {username}.username,
                    password: {password}.password,
                    club: {clubName}.clubName
                })
            })
            .then(res => console.log(res.json()))
            .then(clearForm())
            .then(setSuccessMsg("You have successfully registered."))
        }
    };
    const clubRepresentativeForm = () => {
        return <FadeIn>
                <p ref={successRef} className={successMsg ? "successMsg" : "offscreen"}>{successMsg}</p>
                <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>{errMsg}</p>
                <form  method="POST" action="/newCR" className="clubRepresentativeForm" onSubmit={submitNewCR}> 
                    <div className="field">
                        <label htmlFor="name">
                            Name 
                        </label><br />
                        <input
                            type= "text"
                            id = "name"
                            name = "name" 
                            value = {name}
                            onChange={(e) => {setName(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="username">
                            Username 
                        </label><br />
                        <input
                            type= "text"
                            id = "username" 
                            name = "username"
                            value = {username}
                            onChange={(e) => {setUsername(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">
                            Password 
                        </label><br />
                        <input
                            type="password"
                            id ="password" 
                            name = "password"
                            value = {password}
                            onChange={(e) => {setPassword(e.target.value)}}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="clubName">
                            Club to Represent 
                        </label><br />
                        <input
                            type= "text"
                            id = "clubName" 
                            name = "name"
                            value = {clubName}
                            onChange={(e) => {setClubName(e.target.value)}}
                            required
                        />
                    </div>
                    <button type="submit" disabled={!getIsFormValid("clubRepresentative")}> 
                        Create account 
                    </button>  
                </form>
                </FadeIn>
    };

    const submitNewSM = async (e) => {
        e.preventDefault(); 
        var exisitingUsername = false;
        var takenStadium = false;
        var invalidStadium = true;
        users.forEach(user => {
            if (user.username == username) {
                exisitingUsername = true;
            }
        });
        stadiumManagers.forEach(manager => {
            if (manager.name == stadiumName) {
                takenStadium = true;
            }
        });
        stadiums.forEach(stadium => {
            if (stadium.name == stadiumName) {
                invalidStadium = false;
            }
        });
        if (exisitingUsername) setErrMsg("This username is unavailable")
        else if (takenStadium) setErrMsg("This stadium already has a manager")
        else if (invalidStadium) setErrMsg("This stadium does not exist")
        else {
            const newData = await fetch('http://localhost:5000/newSM', {
                method: 'POST', 
                url: 'http://localhost:5000',
                header : {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: {name}.name,
                    username: {username}.username,
                    password: {password}.password,
                    stadium: {stadiumName}.stadiumName
                })
            })
            .then(res => console.log(res.json()))
            .then(clearForm())
            .then(setSuccessMsg("You have successfully registered."))
        }
    };
    const stadiumManagerForm = () => {
        return  <FadeIn>
                    <p ref={successRef} className={successMsg ? "successMsg" : "offscreen"}>{successMsg}</p>
                    <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>{errMsg}</p>
                    <form  method="POST" action="/newSM" className="stadiumManagerForm" onSubmit={submitNewSM}> 
                        <div className="field">
                            <label htmlFor="name">
                                Name 
                            </label><br />
                            <input
                                type= "text"
                                id = "name" 
                                name = "name"
                                value = {name}
                                onChange={(e) => {setName(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="username">
                                Username 
                            </label><br />
                            <input
                                type= "text"
                                id = "username" 
                                name = "username"
                                value = {username}
                                onChange={(e) => {setUsername(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">
                                Password 
                            </label><br />
                            <input
                                type= "password"
                                id = "password" 
                                name = "password"
                                value = {password}
                                onChange={(e) => {setPassword(e.target.value)}}
                                autoComplete='new-password'
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="stadiumName">
                                Stadium to Manage 
                            </label><br />
                            <input
                                type= "text"
                                id = "stadiumName" 
                                name = "stadiumName"
                                value = {stadiumName}
                                onChange={(e) => {setStadiumName(e.target.value)}}
                                required
                            />
                        </div>
                        <button type="submit" disabled={!getIsFormValid("stadiumManager")}> 
                            Create account 
                        </button>  
                    </form>
                </FadeIn>
    };

    const navigate = useNavigate();

    const logIn = (e) => {
        e.preventDefault();
        var foundUsr = false;
        var foundPw = false;
        var type = "";
        users.forEach(user => {
            if (user.username == username) {
                foundUsr = true;
                if (user.password == password) {
                    foundPw = true;
                    type = user.type;
                }
            }
        });
        if (!foundUsr || !foundPw) {
            setErrMsg("Invalid username or password")
        } else {
            switch(type) {
                case 0: navigate("/admin-dashboard"); break;
                case 2: navigate("/manager-dashboard"); break;
                case 3: navigate("/club-representative-dashboard"); break;
                case 4: navigate("/stadium-manager-dashboard"); break;
                default: navigate("/fan-dashboard"); break;
            }
            setLoggedInUser(username);
        }
    };
    const logInForm = () => {
        return  <FadeIn><div>
                <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>{errMsg}<img width="13px" src={exc}/></p>
                <form autoComplete='new-password' className="logInForm" > 
                    <div className="field"> 
                        <label htmlFor="username">Username</label><br />
                        <input
                            type="text"
                            id ="username" 
                            value = {username}
                            autoComplete="new-password"
                            autoFocus="on"
                            onChange={(e) => {setUsername(e.target.value);}}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">
                            Password
                        </label><br />
                        <input
                            type="password"
                            id ="password" 
                            value = {password}
                            autoComplete="new-password"
                            onChange={(e) => {setPassword(e.target.value);}}
                            required
                            
                        />
                    </div>
                    <p>Forgot Password?</p>
                    <button onClick={logIn} disabled={!getIsFormValid("logIn")}> 
                        Log In
                    </button>  
                </form></div>
                </FadeIn>
    };

    switch(props.type) {
        case "manager":
            return managerForm();
        case "clubRepresentative":
            return clubRepresentativeForm();
        case "stadiumManager":
            return stadiumManagerForm();
        case "fan": 
            return fanForm();
        default:
            return logInForm();
    }
}

export default Form;