import React from 'react';
import './JobCard.css';

import JobHeader from '../JobHeader/JobHeader';
import JobPayRange from '../JobPayRange/JobPayRange';
import JobSkillsList from '../JobSkillsList/JobSkillsList';
import JobProgress from '../JobProgress/JobProgress';
import { Collapse, CardActions, IconButton } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

import ReactMarkdown from 'react-markdown';
import JobsMap from '../Map/JobsMap';

export default function JobCard(props) {

    let { job, userSkills, onClick } = props;

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

  return (
    <div className={`job ${job.failed ? 'failed' : ''}`}>
      {job.company.location && (
        <div style={{position: "absolute",height: "5rem", top: 0, left: 0, right: 0}}>
          <JobsMap location={job.company.location} polygonpoints={job.company.polygonpoints}></JobsMap>
        </div>
        )}
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
      <div className="content flex-wrap">
        <JobPayRange
          min={job.renumeration.min}
          max={job.renumeration.max}
          quoted={job.renumeration.quoted}
          period={job.renumeration.period}
          />
        <JobSkillsList
          skills={job.skills}
          userSkills={userSkills || []}
        />
      </div>
      {job.company.address && job.company.address !== '' && <div className="address"><i className="material-icons">
        business
        </i><a target="_blank" href={`http://maps.google.com/?q=${job.company.address}`}>{job.company.address}</a>
      </div>}
      <CardActions>
        <IconButton onClick={()=>onClick(job)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleExpandClick} style={{marginLeft: 'auto'}}>
          <ExpandMoreIcon className={`expand ${expanded && 'expandOpen'}`} />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ReactMarkdown className="content description" source={job.description} />
      </Collapse>
    </div>
  );
}
