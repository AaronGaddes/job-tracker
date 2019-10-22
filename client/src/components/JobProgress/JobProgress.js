import React from 'react';
import './JobProgress.css';

export default function JobProgress(props) {

    let { progress, failed } = props;

    return(
        <div className={`progress ${failed ? 'failed' : ''}`}>
            {progress.map(stage => (<div key={stage.stage} className={`stage ${stage.doneDate ? 'done' : ''}`} title={stage.stage} data-date={stage.doneDate} data-scheduled={stage.scheduledDate}></div>))}
        </div>
    );
}