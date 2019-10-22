import React from 'react';
import styles from './JobEditDialog.module.css';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import JobHeader from '../JobHeader/JobHeader';

function JobEditDialog(props) {

  let {job, handleClose} = props;

  

  return(
    job ?
    <Dialog
    open={job ? true : false}
    onClose={handleClose}
    scroll={'paper'}
    fullWidth={true}
    aria-labelledby="scroll-dialog-title"
  >
  <JobHeader
    logo={job.logo}
    title={job.title}
    company={job.company}
    type={job.type}
    id="scroll-dialog-title"
  />
    <DialogContent dividers={true}>
        <div>
          {job.progress.map((stage,index) => (
            <div key={index} className={stage.scheduledDate ? styles.scheduled : stage.doneDate ? styles.done : ''}>
              <div className={styles.heading}>
                <div className={styles.circle}>
                  {
                    (stage.doneDate || stage.scheduledDate) ?
                    (
                      <i className="material-icons">
                      {stage.scheduledDate ? 'event' : stage.doneDate ? 'check' : '' }
                      </i>
                    )
                    :
                    (
                      <span>{index + 1}</span>
                    )
                  }
          </div>
                <input className={styles.label} value={stage.stage}></input>
              </div>
              <div className={styles.content}>
                {(stage.doneDate || stage.scheduledDate) ? <span className={styles.date}>{stage.doneDate || stage.scheduledDate}</span> : ''}
                <div>Notes:</div>
                <div contentEditable className={styles.notes}>This is some notes</div>
            </div>
          </div>
          ))}

          <div className={styles.add}>
            <div className={styles.heading}>
              <div className={styles.circle}><i className="material-icons">
        add
        </i></div>
            </div>
          </div>
        </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleClose} color="primary">
        Subscribe
      </Button>
    </DialogActions>
  </Dialog>
    : ''
    
  )
}

export default JobEditDialog;