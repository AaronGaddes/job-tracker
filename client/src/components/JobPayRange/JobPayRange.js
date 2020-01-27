import React from 'react';
import './JobPayRange.css';

import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';

export default function JobPayRange(props) {

    let { min, max, quoted, period } = props;

  return (
    <div className="renumeration">
      <div>
        <div className="max"><VerticalAlignTopIcon />${max && max.toLocaleString()}</div>
        <div className="min"><VerticalAlignBottomIcon />${min && min.toLocaleString()}</div>
      </div>
      <div className="quoted">${quoted && quoted.toLocaleString()} <span className="period">p/{period}</span> </div>
    </div>
  )
}