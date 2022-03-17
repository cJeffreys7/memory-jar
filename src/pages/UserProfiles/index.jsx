import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';

const UserProfiles = () => {
    const [userProfiles, setUserProfiles] = useState([]);

    const fetchUserProfiles = () => {
        axios.get("http://localhost:8080/api/user-profile")
        .then(res=> {
        console.log(res);
        setUserProfiles(res.data);
        });
    }

    useEffect(() => {
        fetchUserProfiles();
    }, []);
    return userProfiles.map((userProfile, index) => {
        return (
            <div key={index}>
                {userProfile.userProfileId ? <img src={`http://localhost:8080/api/user-profile/${userProfile.userProfileId}/image/download`} alt='User profile'/> : null}
                <br/>
                <br/>
                <h1>{userProfile.username}</h1>
                <p>{userProfile.userProfileId}</p>
                <Dropzone {...userProfile} />
                <br/>
            </div>
        )
    });
};

export default UserProfiles;