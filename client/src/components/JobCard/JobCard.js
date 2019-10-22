import React from 'react';
import './JobCard.css';

import JobHeader from '../JobHeader/JobHeader';
import JobPayRange from '../JobPayRange/JobPayRange';
import JobSkillsList from '../JobSkillsList/JobSkillsList';
import JobProgress from '../JobProgress/JobProgress';

export default function JobCard(props) {

    let { job, userSkills, onClick } = props;

  return (
    <div className={`job ${job.failed ? 'failed' : ''}`} onClick={()=>onClick(job)}>
      <JobHeader
        logo={job.logo}
        title={job.title}
        company={job.company}
        type={job.type}
      />
      <JobProgress
        progress={job.progress}
        failed={job.failed}
      />
      <div className="content">
        <JobPayRange
          min={job.renumeration.min}
          max={job.renumeration.max}
          quoted={job.renumeration.quoted}
          period={job.renumeration.period}
          />
        <JobSkillsList
          skills={job.skills}
          userSkills={userSkills}
        />
      </div>
      <div className="address"><i className="material-icons">
        business
        </i>{job.address}
      </div>
    </div>
  );
}
