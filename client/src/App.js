import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';

import './App.css';
import Navbar from './components/Navbar';
import JobList from './components/JobList/JobList';

import JobEditDialog from './components/JobEditDialog/JobEditDialog';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        loading: {
          user: false,
          jobs: false
        },
        user: {
            skills: {
                HTML: true,
                CSS: true,
                JS: true
            }
        },
        jobs: [
            // {
            //     title: 'Junior Software Developer',
            //     company: 'A Cloud Guru',
            //     logo: 'https://media.glassdoor.com/sqls/1434775/a-cloud-guru-squarelogo-1527500133047.png',
            //     progress: [
            //         {
            //             stage: 'Initial Application',
            //             scheduledDate: null,
            //             doneDate: '8-Oct',
            //             notes: null
            //         },
            //         {
            //             stage: 'Initial Call',
            //             scheduledDate: null,
            //             doneDate: '10-Oct',
            //             notes: null
            //         },
            //         {
            //             stage: 'Interview',
            //             scheduledDate: '20-Oct',
            //             doneDate: null,
            //             notes: null
            //         }
            //     ],
            //     type: 'Full Time',
            //     experience: `At least 1 year of professional software development experience
            //     Used any OO language in production based systems Desirable`,
            //     coverletter: {
            //         type: 'link',
            //         content: 'Cover Letter - ACloudGuru',
            //         link: 'https://drive.google.com/open?id=1Vp1KJV5Wo4njpXZVQg6Cl7JsvZvnh9dUZ8atF0dAFL8'
            //     },
            //     skills: [
            //         'HTML','CSS','JS','HTML5','CSS3'
            //     ],
            //     address: 'Level 13/31 Queen St, Melbourne VIC 3000',
            //     renumeration: {
            //         min: 70000,
            //         max: 90000,
            //         quoted: 80000,
            //         period: 'anum'
            //     },
            //     failed: false
            // }
        ],
        selectedJob: null
    }

    this.selectJob = this.selectJob.bind(this);
  }

  selectJob(job) {
    this.setState({
      selectedJob: job
    });
    console.log(job)
  }

  handleDialogClose = () => {
    this.selectJob(null);
  };

  clickHandler = async() => {
    let response = await fetch('http://localhost:5000/jobs',{credentials: 'include'});
    let jobs = await response.json();
    console.log(jobs);
  }

  async componentWillMount() {
    this.setState({...this.state, loading: {
      ...this.state.loading,
      user: true
    }});
    let response = await fetch('http://localhost:5000/auth/authenticate',{credentials: 'include'});
    let {user} = await response.json();
    console.log(user);

    this.setState(
      {
        ...this.state,
        loading: {
          ...this.state.loading,
          user: false
        },
        sessionUser: user
    });

    if(user) {
      this.setState({
        ...this.state,
        loading: {
          ...this.state.loading,
          jobs: true
        }
      });
      let jobsResponse = await fetch('http://localhost:5000/api/v1/jobs',{credentials: 'include'});
      let {jobs} = await jobsResponse.json();
      console.log(jobs);
      this.setState(
        {
          ...this.state,
          loading: {
            ...this.state.loading,
            jobs: false
          },
          jobs: jobs
        });
      }
    
  }

  render(){
    return (
      <div className="App">
        <Navbar sessionUser={this.state.sessionUser} />
        {this.state.loading.jobs ? (
          <div className="progressCircle">
            <CircularProgress />
          </div>
          ) : (<JobList
          jobs={this.state.jobs}
          userSkills={this.state.user.skills}
          selectJob={this.selectJob}
        />)}
        <JobEditDialog
          job={this.state.selectedJob}
          handleClose={this.handleDialogClose}
        />
      </div>
    )
  }
}

export default App;
