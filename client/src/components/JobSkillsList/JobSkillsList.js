import React from 'react';
import styles from './JobSkillsList.module.css';

export default function JobSkillsList(props) {

    let {skills, userSkills} = props;

    const hasSkill = (skill) => {
      return userSkills.find(s=>s==skill)
    }

  return (
    <div className="skill-list">
        {skills.map(skill => (<span key={skill.name} className={`${styles.skill} ${hasSkill(skill.name) ? styles.have : ''} ${skill.required ? styles.required : ''}`}>{skill.name}</span>))}
    </div>
  )
}