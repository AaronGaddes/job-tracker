import React, { useState, useEffect } from "react";
import {
    useParams,
    withRouter,
    Link,
    Redirect
} from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';

import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
  } from '@material-ui/pickers';

import styles from './Job.module.css';

import JobHeader from '../JobHeader/JobHeader';
import JobSkillsList from "../JobSkillsList/JobSkillsList";

function Job(props) {
    let { id } = useParams();

    let { updateJob } = props;

    const [job,setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [toHome, setToHome] = useState(false);

    const [newSkillName, setNewSkillName] = useState('');
    
    useEffect(() => {
        if(id) {
            fetch(`http://localhost:5000/api/v1/jobs/${id}`,{credentials: 'include'})
                .then(res => res.json())
                .then(job => {
                    setJob(job);
                    setIsLoading(false);
                })
                .catch(error => console.log(error));
        } else {
            setJob({
                "company": {
                  "name": "",
                  "address": "",
                  "logoURL": ""
                },
                "renumeration": {
                  "min": 0,
                  "max": 0,
                  "quoted": 0,
                  "period": "anum"
                },
                "skills": [],
                "title": "",
                "progress": [
                  {
                    "stage": "Initial Application",
                    "scheduledDate": null,
                    "doneDate": null,
                    "notes": ""
                  }
                ],
                "type": "Full Time",
                "description": "",
                "failed": false,
              });
            setIsLoading(false);
        }
    }, []);

    const handleChange = fieldName => event => {
        setJob({...job, [fieldName]: event.target.value});
    }

    const handleFailedChange = event => {
        setJob({...job, failed: event.target.checked});
    }

    const handleCompanyChange = fieldName => event => {
        let company = {...job.company, [fieldName]: event.target.value};
        setJob({...job, company});
    }

    const handleRenumerationChange = fieldName => event => {
        let renumeration = {...job.renumeration, [fieldName]: event.target.value};
        setJob({...job, renumeration});
    }

    const handleNewSkillInputChange = event => {
        setNewSkillName(event.target.value);
    }

    const addSkill = () => {
        let skills = [...job.skills];

        // only add if skill doesn't already exist
        if(skills.findIndex((s)=>s.name.toLowerCase() == newSkillName.toLowerCase()) == -1){
            let newSkill = {
                name: newSkillName,
                required: false
            }

            skills.push(newSkill);

            setJob({...job, skills});
        }

        setNewSkillName('');
    }

    const handleSkillEnterPress = event => {
        if(event.keyCode == 13) {
            addSkill();
        }
    }

    const handleSkillClick = i => {
        let skills = [...job.skills];

        skills[i].required = !skills[i].required;

        setJob({...job, skills});

    }

    const handleSkillDelete = i => {
        let skills = [...job.skills];

        skills.splice(i,1);

        setJob({...job, skills});
    }

    const handleProgressStageChange = (i, fieldName) => event => {
        let progress = [...job.progress];

        progress[i][fieldName] = (event && event.target && event.target.value) || event;

        setJob({...job, progress});
    }
    
    const handleAddProgressStage = () => {
        let progress = [...job.progress];

        progress.push({
            stage: '',
            notes: '',
            doneDate: null,
            scheduledDate: null
        });

        setJob({...job, progress});
    }

    const handleProgressStageDelete = i => {
        let progress = [...job.progress];

        progress.splice(i,1);

        setJob({...job, progress});
    }

    const handleCancel = () => {
        props.history.push('/');
    }

    const handleSave = () => {
        setIsSaving(true);

            fetch(`http://localhost:5000/api/v1/jobs/`,
                {
                    method: id ? 'PUT' : 'POST',
                    credentials: 'include',
                    body: JSON.stringify(job),
                    headers: {
                        'Content-Type': 'application/json'
                      }
                })
                .then(res => res.json())
                .then(newJob => {
                    
                    updateJob(newJob);
                    setIsSaving(false);
                    // props.history.push(`/${newJob._id}`);
                    setToHome(true);
                })
                .catch(error => console.log(error));

    }

    
    return (
        <>
            {isLoading && <CircularProgress />}
            {job && <div>
            <JobHeader
                logo={job.logo}
                title={job.title}
                company={job.company}
                type={job.type}
            />
            <form noValidate>
                <div className={styles.inputGroup}>
                    <Typography variant="h4">Basic Info</Typography>
                    <div className={styles.jobTitleGroup}>
                        <TextField
                            id="title"
                            label="title"
                            value={job.title}
                            onChange={handleChange('title')}
                            fullWidth
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                            <Switch checked={job.failed} onChange={handleFailedChange} value={job.failed} />
                            }
                            label="Failed"
                        />
                    </div>
                    <FormControl>
                        <InputLabel htmlFor="contract-type">Contract</InputLabel>
                        <Select
                        value={job.type}
                        onChange={handleChange('type')}
                        inputProps={{
                            name: 'type',
                            id: 'contract-type',
                        }}
                        >
                        <MenuItem value="Part Time">Part Time</MenuItem>
                        <MenuItem value="Full Time">Full Time</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="description"
                        label="description"
                        value={job.description}
                        onChange={handleChange('description')}
                        multiline
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Typography variant="h4">Company</Typography>
                    <TextField
                        id="companyName"
                        label="name"
                        value={job.company.name}
                        onChange={handleCompanyChange('name')}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="companyLogoURL"
                        label="logo URL"
                        value={job.company.logoURL}
                        onChange={handleCompanyChange('logoURL')}
                        multiline
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="companyAddress"
                        label="address"
                        value={job.company.address}
                        onChange={handleCompanyChange('address')}
                        multiline
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Typography variant="h4">Skills</Typography>
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
                                job.skills.map((skill,i)=>(
                                    <Chip
                                        key={skill.name}
                                        variant={skill.required ? undefined : "outlined"}
                                        color="primary"
                                        className={styles.skill}
                                        label={skill.name}
                                        onClick={() => handleSkillClick(i)}
                                        onDelete={() => handleSkillDelete(i)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <Typography variant="h4">Renumeration</Typography>
                    <TextField
                        id="min"
                        label="min"
                        autoComplete="off"
                        value={job.renumeration.min}
                        onChange={handleRenumerationChange('min')}

                    />
                    <TextField
                        id="quoted"
                        label="quoted"
                        autoComplete="off"
                        value={job.renumeration.quoted}
                        onChange={handleRenumerationChange('quoted')}

                    />
                    <TextField
                        id="max"
                        label="max"
                        autoComplete="off"
                        value={job.renumeration.max}
                        onChange={handleRenumerationChange('max')}

                    />
                </div>
                <div className={styles.inputGroup}>
                    <Typography variant="h4">Progress</Typography>
                    {job.progress.map((stage,index) => (
                        <div key={index} className={stage.scheduledDate ? styles.scheduled : stage.doneDate ? styles.done : ''}>
                        <div className={styles.heading}>
                            <div className={styles.circle}>
                            {
                                (stage.doneDate || stage.scheduledDate) ?
                                (
                                <i className="material-icons">
                                {stage.scheduledDate ? 'event' : stage.doneDate ? 'check' : '' }
                                </i>
                                )
                                :
                                (
                                <span>{index + 1}</span>
                                )
                            }
                    </div>
                        <TextField
                                id={`stage-${index}-stage`}
                                label="stage"
                                fullWidth
                                value={stage.stage}
                                onChange={handleProgressStageChange(index,'stage')}
                                margin="normal"
                                className={styles.label}
                            />
                        <IconButton aria-label="delete"
                            onClick={() => handleProgressStageDelete(index)}>
                            <DeleteIcon />
                        </IconButton>
                        </div>
                        <div className={styles.content}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    margin="normal"
                                    variant="inline"
                                    id={`stage-${index}-scheduled-date`}
                                    label="Scheduled"
                                    value={stage.scheduledDate}
                                    onChange={handleProgressStageChange(index,'scheduledDate')}
                                />
                                <KeyboardDateTimePicker
                                    margin="normal"
                                    variant="inline"
                                    id={`stage-${index}-done-date`}
                                    label="Completed"
                                    value={stage.doneDate}
                                    onChange={handleProgressStageChange(index,'doneDate')}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField
                                id={`stage-${index}-notes`}
                                label="notes"
                                value={stage.notes}
                                onChange={handleProgressStageChange(index,'notes')}
                                multiline
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    </div>
                    ))}
                    <div className={styles.add}>
                        <div className={styles.heading}>
                            <ButtonBase
                                focusRipple
                                className={styles.circle}
                                focusVisibleClassName={styles.circle}
                                onClick={handleAddProgressStage}
                                >
                                    <i className="material-icons">
                                        add
                                    </i>
                                </ButtonBase>
                        </div>
                    </div>
                </div>
                <div className={`${styles.inputGroup} ${styles.actionButtonGroup}`}>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" disabled={isSaving} onClick={handleSave}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
            </div>
            }
            {toHome && <Redirect to="/" push={true}/>}
        </>
    );
}

export default withRouter(Job);