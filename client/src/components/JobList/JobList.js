import React from 'react';
import "./JobList.css";

import JobCard from '../JobCard/JobCard';

function JobList(props) {

    let {jobs, userSkills} = props;
    
    return (
        <div className="job-list">
            {jobs.map(job=>(
                <JobCard
                    key={`${job.title}-${job.company}`}
                    job={job}
                    userSkills={userSkills}
                />)
            )}
        </div>
    );
}

export default JobList;