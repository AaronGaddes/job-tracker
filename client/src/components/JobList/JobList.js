import React from 'react';
import styles from "./JobList.module.css";

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {
    withRouter
  } from 'react-router-dom'


import JobCard from '../JobCard/JobCard';

function JobList(props) {

    let {jobs, userSkills} = props;

    const handleAddNew = () => {
        props.history.push('/add');
    }

    console.log(props.location.state);

    const handleJobClick = (job) => {
        props.history.push(`/${job._id}`);
    }
    
    return (
        <div className={`${styles.jobList}`}>
            {jobs.map((job, i)=>(
                <JobCard
                    key={`${job.title}-${job.company}`}
                    job={job}
                    userSkills={userSkills}
                    onClick={()=>handleJobClick(job)}
                />
                )
            )}
            <div className={styles.addNew} onClick={handleAddNew}>Add New</div>
        </div>
    );
}

export default withRouter(JobList);