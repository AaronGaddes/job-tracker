import React from 'react';
import styles from './JobProgress.module.css';
import { format } from 'date-fns';
export default function JobProgress(props) {

    let { progress, failed } = props;

    const handleShowDate = (date) => {
        let formatted = ''
        if(date) {
            formatted = format(new Date(date), 'dd-MMM');
        }
        return formatted;
    }

    return(
            <div className={`${styles.progress} ${failed ? styles.failed : ''}`}>
                {
                    progress.map(stage => (
                        <div
                            key={stage.stage}
                            className={`${styles.stage} ${stage.doneDate ? styles.done : stage.scheduledDate ? styles.scheduled : ''}`}
                            title={stage.stage}
                            data-date={handleShowDate(stage.doneDate || stage.scheduledDate)}
                            ></div>))}
            </div>
    );
}