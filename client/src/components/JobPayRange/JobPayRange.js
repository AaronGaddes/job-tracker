import React from 'react';
import './JobPayRange.css';

export default function JobCard(props) {

    let { min, max, quoted, period } = props;

  return (
    <div className="renumeration">
        <div className="expected-range__min">${min.toLocaleString()}</div>
        <div className="quoted">${quoted.toLocaleString()} <span className="period">p/{period}</span> </div>
        <div className="expected-range__max">${max.toLocaleString()}</div>
    </div>
  )
}