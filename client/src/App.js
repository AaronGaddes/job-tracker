import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
        user: null,
        jobs: [],
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
        user: user
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
        <Navbar user={this.state.user} />
        {this.state.loading.jobs ? (
          <div className="progressCircle">
            <CircularProgress />
          </div>
          ) : (<JobList
          jobs={this.state.jobs}
          userSkills={(this.state.user && this.state.user.skills) || []}
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
