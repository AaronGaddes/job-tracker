import React from 'react';
import './JobSkillsList.css';

export default function JobSkillsList(props) {

    let {skills, userSkills} = props;

  return (
    <div className="skill-list">
        {skills.map(skill => (<span key={skill} className={`skill ${userSkills[skill] ? 'have' : ''}`}>{skill}</span>))}
    </div>
  )
}