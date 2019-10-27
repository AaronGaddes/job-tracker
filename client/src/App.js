import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Container from '@material-ui/core/Container';

import './App.css';
import Navbar from './components/Navbar';
import JobList from './components/JobList/JobList';
import Job from './components/Job/Job';

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
    this.updateJob = this.updateJob.bind(this);
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

  async loadJobs() {
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

  async componentWillMount() {
    await this.loadJobs();
    
  }

  async updateJob(job) {
    let jobs = [...this.state.jobs];
    let i = jobs.findIndex(j=>j._id == job._id);
    if(i !== -1) {
      jobs[i] = job;
    } else {
      jobs.push(job);
    }
    this.setState({...this.state, jobs});
  }

  render(){
    return (
      <Router>
        <div className="App">
          <Navbar user={this.state.user} />
          <Container>
            <Switch>
              <Route path="/add">
                <Job updateJob={this.updateJob} />
              </Route>
              <Route path="/:id">
                <Job updateJob={this.updateJob} />
              </Route>
              <Route path="/">
              {this.state.loading.jobs ? (
                <div className="progressCircle">
                  <CircularProgress />
                </div>
                ) : (<JobList
                jobs={this.state.jobs}
                userSkills={(this.state.user && this.state.user.skills) || []}
                selectJob={this.selectJob}
              />)}
              </Route>
            </Switch>
          </Container>
        </div>
      </Router>
    )
  }
}

export default App;
