import React, { useState, useEffect } from "react";
import {
    useParams,
    withRouter,
    Link,
    Redirect
} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ButtonBase from '@material-ui/core/ButtonBase';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EventIcon from '@material-ui/icons/Event';
import CheckIcon from '@material-ui/icons/Check';
import DescriptionIcon from '@material-ui/icons/Description';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
  } from '@material-ui/pickers';

import styles from './Job.module.css';

import JobHeader from '../JobHeader/JobHeader';
import JobSkillsList from "../JobSkillsList/JobSkillsList";
import JobsMap from "../Map/JobsMap";

function Job(props) {
    let { id } = useParams();

    let { updateJob, deleteJob, user, generatedJob } = props;

    const [job,setJob] = useState(generatedJob || null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // for generating from url
    const [generateUrl, setGenerateUrl] = useState('');

    const [hasError, setHasError] = useState(false);

    const [toHome, setToHome] = useState(false);

    const [newLink, setNewLink] = useState({
        title: '',
        link: ''
    })

    const [newSkillName, setNewSkillName] = useState('');
    
    useEffect(() => {
        setHasError(false);
        if(id) {
            if(user) {
                // Logged in user
                fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/jobs/${id}`,{credentials: 'include'})
                    .then(res => res.json())
                    .then(job => {
                        setJob(job);
                        setIsLoading(false);
                    })
                    .catch(error => console.log(error));
            } else {
                // Anonomous user
                try {
                    let job = JSON.parse(window.localStorage.getItem('jobs')).find(j=>j._id==id);
                    setJob(job);
                } catch (error) {
                    setHasError(true);
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
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
                    "doneDate": Date.now(),
                    "notes": ""
                  }
                ],
                "type": "Full Time",
                "description": "",
                "failed": false,
              });
            setIsLoading(false);
        }
    }, [user]);

    const handleChange = fieldName => event => {
        setJob({...job, [fieldName]: event.target.value});
    }

    const handleFailedChange = event => {
        setJob({...job, failed: event.target.checked});
    }

    const handleAddLink = () => {
        let links = job.links || [];
        links.push(newLink);
        setNewLink({
            title: '',
            link: ''
        })
        setJob({...job,links});
    }

    const handleLinkClick = link => {
        window.open(link.link, '_blank');
    }

    const handleLinkDelete = i => {
        let links = job.links;
        links.splice(i);
        setJob({...job, links});
    }

    const handleNewLinkItemChange = fieldName => event => {
        setNewLink({...newLink, [fieldName]: event.target.value});
    }

    const handleCompanyChange = fieldName => event => {
        let company = {...job.company, [fieldName]: event.target.value || event.target.innerText};
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

        if(user){
            fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/jobs/`,
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
        } else {
            // Anonymous user
            let jobs = JSON.parse(window.localStorage.getItem('jobs')) || [];
            let newJob = {...job}
            if(id) {
                let currentJobIndex = jobs.findIndex(j=>j._id == id);
                jobs[currentJobIndex] = newJob;
            } else {
                newJob._id = btoa(`${Date.now()}_${Math.random()}`);
                jobs.push(newJob);
            }
            window.localStorage.setItem('jobs',JSON.stringify(jobs));
            updateJob(newJob);
            setIsSaving(false);
            // props.history.push(`/${newJob._id}`);
            setToHome(true);
        }

    }

    const handleDelete = () => {
        setIsDeleting(true);

        if(user) {
            fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/jobs/${id}`,{method: 'DELETE', credentials: 'include'})
                .then(res=>res.json())
                .then(deletedJob=>{
                    if(deletedJob._id){
                        deleteJob(deletedJob._id);
                    }
                }).catch(error => console.log(error))
                .finally(()=>{
                    setIsDeleting(false);
                    setToHome(true);
                })

        } else {
            // Anonymous user
            let jobs = JSON.parse(window.localStorage.getItem('jobs')) || [];
            console.log('jobId', id);
            console.log('jobs', JSON.stringify(jobs));
            if(id) {
                let currentJobIndex = jobs.findIndex(j=>j._id == id);
                jobs.splice(currentJobIndex,1);
                console.log('jobs after splice', JSON.stringify(jobs));
                window.localStorage.setItem('jobs',JSON.stringify(jobs));
                deleteJob(id);
            }
            setIsDeleting(false);
            setToHome(true);
        }
    }


  const generateFromUrl = async (e) => {

    setIsLoading(true);

    e.preventDefault();

    let reqBody = {
      srcUrl: generateUrl
    }

    try {
      let url = `${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/generate`;
      console.log(url);
      console.log(reqBody);
      
      let res = await fetch(url,{
        method: 'POST',
        body: JSON.stringify(reqBody),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(res.ok) {
          let generatedJob = await res.json();
          setJob(generatedJob);
      }


    } catch (error) {
      
    } finally {
        setIsLoading(false);
    }
    
  }

  const searchAddress = async () => {
      setIsAddressLoading(true);
      try {
          let locationDetails = await fetch(`https://nominatim.openstreetmap.org/search/${job.company.address}?format=json&addressdetails=1&limit=1`).then(res=>res.json());
                  
              if(locationDetails.length > 0) {
                  
                  let company = {...job.company};
                  company.location = {
                          latitude: locationDetails[0].lat,
                          longitude: locationDetails[0].lon
                  };
      
                  setJob({...job,company});
              }
      } catch {

      } finally {
          setIsAddressLoading(false);
      }
  }


    
    return (
        <>
            {!id && (
                <Paper className={styles.inputGroup}>
                    <form onSubmit={generateFromUrl}>
                    <TextField fullWidth placeholder="Add from Seek or Indeed URL" name="srcUrl" id="srcUrl" value={generateUrl} onChange={(e) => setGenerateUrl(e.target.value)} />
                    </form>
                </Paper>
                )
            }
            {isLoading && <CircularProgress />}
            {hasError && <Paper>There was an issue retreiving the Job information.</Paper>}
            {job && !hasError && !isLoading && <div>
                {/* <Paper>
                    <JobHeader
                        logo={job.logo}
                        title={job.title}
                        company={job.company}
                        type={job.type}
                    />
                </Paper> */}
            <form noValidate>
                <div className={styles.formGrid}>
                    <Paper className={styles.inputGroup}>
                        <Typography variant="h5">Basic Info</Typography>
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
                        <Typography variant="h6">Skills</Typography>
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
                                            key={i}
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
                    </Paper>
                    <Paper className={styles.inputGroup}>
                        <Typography variant="h5">Links</Typography>
                            <TextField
                                    id="LinkTitle"
                                    label="title"
                                    value={newLink.title}
                                    onChange={handleNewLinkItemChange('title')}
                                    margin="normal"
                                />
                                <TextField
                                    id="LinkLink"
                                    label="link"
                                    fullWidth
                                    value={newLink.link}
                                    onChange={handleNewLinkItemChange('link')}
                                    margin="normal"
                                />
                            <Fab size="small" color="primary" aria-label="add" onClick={handleAddLink}>
                                <AddIcon />
                            </Fab>
                            <div className={styles.linksContainer}>
                                {job.links && job.links.map((link,i) => (
                                        <Chip
                                            key={i}
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            icon={<OpenInNewIcon />}
                                            label={link.title}
                                            onClick={() => handleLinkClick(link)}
                                            onDelete={() => handleLinkDelete(i)}
                                        />
                                ))}
                            </div>
                    </Paper>
                    <Paper className={styles.inputGroup}>
                        <Typography variant="h5">Company</Typography>
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
                            InputProps={{endAdornment:
                                <InputAdornment position="end">
                                    <IconButton onClick={searchAddress}>
                                        <LocationSearchingIcon />
                                    </IconButton>
                                </InputAdornment>
                              }}
                        />
                        {isAddressLoading && <CircularProgress />}
                        {!isAddressLoading && job.company && job.company.location && job.company.location.latitude && job.company.location.longitude && (
                            <div style={{position: "relative", height: "8rem"}}>
                                <JobsMap location={job.company.location} />
                            </div>
                        )}
                    </Paper>
                    <Paper className={styles.inputGroup}>
                        <Typography variant="h5">Renumeration</Typography>
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
                    </Paper>
                    <Paper className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <Typography variant="h5">Description</Typography>
                        <TextField
                            id="description"
                            label="description"
                            value={job.description}
                            onChange={handleChange('description')}
                            multiline
                            fullWidth
                            margin="normal"
                        />
                    </Paper>
                </div>
                <Paper className={styles.inputGroup}>
                    <Typography variant="h5">Progress</Typography>
                    {job.progress.map((stage,index) => (
                        <div key={index} className={stage.scheduledDate ? styles.scheduled : stage.doneDate ? styles.done : ''}>
                        <div className={styles.heading}>
                        <Avatar className={styles.timelineAvatar}>
                            {
                                (stage.doneDate || stage.scheduledDate) ?
                                (
                                // <i className="material-icons">
                                stage.scheduledDate ? <EventIcon /> : stage.doneDate ? <CheckIcon /> : '' 
                                // </i>
                                )
                                :
                                (
                                <span>{index + 1}</span>
                                )
                            }
                        </Avatar>
                            {/* <div className={styles.circle}>
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
                            </div> */}
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
                            {/* <ButtonBase
                                focusRipple
                                className={styles.circle}
                                focusVisibleClassName={styles.circle}
                                onClick={handleAddProgressStage}
                                >
                                    <i className="material-icons">
                                        add
                                    </i>
                                </ButtonBase> */}
                            <Fab size="small" color="primary" aria-label="add" onClick={handleAddProgressStage}>
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                </Paper>
                <div className={`${styles.inputGroup} ${styles.actionButtonGroup}`}>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="secondary" disabled={isDeleting} onClick={handleDelete}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
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