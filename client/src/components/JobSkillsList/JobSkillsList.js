import React from 'react';
import './JobSkillsList.css';

export default function JobSkillsList(props) {

    let {skills, userSkills} = props;

    const hasSkill = (skill) => {
      return userSkills.find(s=>s==skill)
    }

  return (
    <div className="skill-list">
        {skills.map(skill => (<span key={skill.name} className={`skill ${hasSkill(skill.name) ? 'have' : ''}`}>{skill.name}</span>))}
    </div>
  )
}