import React from 'react';
import "./JobList.css";

import JobCard from '../JobCard/JobCard';

function JobList(props) {

    let {jobs, userSkills, selectJob} = props;
    
    return (
        <div className="job-list">
            {jobs.map((job, i)=>(
                <JobCard
                    key={`${job.title}-${job.company}`}
                    job={job}
                    userSkills={userSkills}
                    onClick={selectJob}
                />)
            )}
        </div>
    );
}

export default JobList;