import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Link } from "react-router-dom";

import JoinLogo from '../assets/Join Logo.svg'

let socket;

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className='join-wrapper'>
            <div className="join-box"> 
                <div className="join-box-wrapper">
                    <img src={JoinLogo} className='join-logo-wrapper' alt='Game Logo' />
                    <div>
                        <input placeholder="Name" className="join-input" type="text" onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div>
                        <input placeholder="Room" className="join-input mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
                    </div>
                    <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/room?name=${name}&room=${room}`}>
                        <button className='join-button mt-20 ' type="submit">Join Game</button>
                    </Link>
                </div>
            </div>
           
        </div>
    );
}

export default Join;