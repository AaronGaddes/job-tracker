import React from 'react';
import styles from "./JobList.module.css";

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {
    withRouter
  } from 'react-router-dom'


import JobCard from '../JobCard/JobCard';
import { Paper, Typography, Card, CardHeader, CardActions, Button } from '@material-ui/core';

function JobList(props) {

    let {jobs, user} = props;

    const handleAddNew = () => {
        props.history.push('/add');
    }

    console.log(props.location.state);

    const handleJobClick = (job) => {
        props.history.push(`/${job._id}`);
    }
    
    return (
        jobs && jobs.length > 0 && <div className={`${styles.jobList}`}>
            {jobs.map((job, i)=>(
                <JobCard
                    key={`${job.title}-${job.company}`}
                    job={job}
                    userSkills={user && user.skills || []}
                    onClick={()=>handleJobClick(job)}
                />
                )
            )}
            {/* <div className={styles.addNew} onClick={handleAddNew}>Add New</div> */}
            <Fab className={styles.fab} color="primary" aria-label="add" onClick={handleAddNew}>
                <AddIcon />
            </Fab>
        </div>
        ||
        <Card>
            <CardHeader
                title="Oops. Looks like you haven't applied for any jobs. Click below to add new job's you've applied for."
            />
            <CardActions>
                <Button size="small" color="primary" onClick={handleAddNew}>Add New</Button>
            </CardActions>
        </Card>
    );
}

export default withRouter(JobList);