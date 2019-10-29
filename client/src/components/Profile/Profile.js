import React, { useState, useEffect } from "react";
import {
    useParams,
    withRouter,
    Link,
    Redirect
} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import styles from './Profile.module.css';

function Profile(props) {

    const {updateUser} = props;

    const [user, setUser] = useState();

    const [newSkillName, setNewSkillName] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const [toHome, setToHome] = useState(false);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/authenticate`,{credentials: 'include'})
            .then(res=>res.json())
            .then(res => {
                
                setUser(res.user);
            });
    }, [])

    const handleNewSkillInputChange = event => {
        setNewSkillName(event.target.value);
    }

    const handleSkillEnterPress = event => {
        if(event.keyCode == 13) {
            let skills = [...user.skills, event.target.value]
            setUser({...user, skills});
        }
    }

    const handleSkillDelete = i => {
        let skills = [...user.skills];
        skills.splice(i);
        setUser({...user, skills});
        setNewSkillName('');
    }

    const handleCancel = () => {
        props.history.push('/');
    }

    const handleSave = () => {
        setIsSaving(true);

            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type': 'application/json'
                      }
                })
                .then(res => res.json())
                .then(newUser => {
                    
                    updateUser(newUser);
                    setIsSaving(false);

                    setToHome(true);
                })
                .catch(error => console.log(error));

    }

    return(
        <>
        {user && 
            (
                <>
                    <h1>{user.displayName}</h1>
                    <Paper className={styles.inputGroup}>
                        <h2>Skills</h2>
                        <div className={styles.skillsContainer}>
                            <TextField
                                id="newSkillName"
                                label="new skill"
                                helperText="Hit Enter to add"
                                autoComplete="off"
                                value={newSkillName}
                                onChange={handleNewSkillInputChange}
                                onKeyDown={handleSkillEnterPress}

                            />
                            <div className={styles.skills}>
                                {
                                    user.skills.map((skill,i)=>(
                                        <Chip
                                            key={i}
                                            color="primary"
                                            className={styles.skill}
                                            label={skill}
                                            onDelete={() => handleSkillDelete(i)}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    </Paper>
                    <div className={`${styles.inputGroup} ${styles.actionButtonGroup}`}>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" disabled={isSaving} onClick={handleSave}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                    {toHome && <Redirect to="/" push={true}/>}
                </>
            )
        }
        </>
    )
}

export default withRouter(Profile);