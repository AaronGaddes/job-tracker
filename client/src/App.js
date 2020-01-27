import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Container from '@material-ui/core/Container';

import styles from './App.module.css';
import Navbar from './components/Navbar';
import JobList from './components/JobList/JobList';
import Job from './components/Job/Job';

import JobEditDialog from './components/JobEditDialog/JobEditDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Profile from './components/Profile/Profile';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import JobsMap from './components/Map/JobsMap';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        loading: false,
        user: null,
        jobs: [],
        selectedJob: null,
        generateUrl: '',
        generatedJob: null
    }

    this.selectJob = this.selectJob.bind(this);
    this.updateJob = this.updateJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
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
    this.setState({...this.state, loading: true});
    let response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/auth/authenticate`,{credentials: 'include'});
    let {user} = await response.json();
    console.log(user);

    this.setState(
      {
        ...this.state,
        loading: false,
        user: user
    });

    if(user) {
      this.setState({
        ...this.state,
        loading: true});
      let jobsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/jobs`,{credentials: 'include'});
      let {jobs} = await jobsResponse.json();
      console.log(jobs);
      this.setState(
        {
          ...this.state,
          loading: false,
          jobs: jobs
        });
      } else {
        // Anonymous user - attempt to load jobs from local storage
        let jobs = JSON.parse(window.localStorage.getItem('jobs')) || [];
        console.log('jobs', jobs);
        
        this.setState({...this.state, jobs});
      }
  }

  async componentWillMount() {
    await this.loadJobs();
    
  }

  handleLoginClick() {
    this.setState({...this.state, loading: true});
    window.location.assign(`${process.env.REACT_APP_API_BASE_URL || ''}/auth/github`);
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

  async deleteJob(id) {
    let jobs = [...this.state.jobs];
    let i = jobs.findIndex(j=>j._id == id);
    if(i !== -1) {
      jobs.splice(i,1);
      this.setState({...this.state, jobs});      
    }

  }

  async updateUser(user) {
    this.setState({...this.state, user});
  }

  render(){
    return (
      <Router>
        <div className="App">
          <Navbar user={this.state.user} updateUser={this.updateUser} />
          <Container maxWidth="md" className={styles.container}>
            <Switch>
              <Route path="/profile">
                <Profile
                  user={this.state.user}
                  updateUser={this.updateUser}
                />
              </Route>
              <Route path="/add">
                <Job updateJob={this.updateJob} user={this.state.user} generatedJob={this.state.generatedJob} />
              </Route>
              <Route path="/:id">
                <Job updateJob={this.updateJob} deleteJob={this.deleteJob} user={this.state.user} />
              </Route>
              <Route path="/map">
                <JobsMap></JobsMap>
              </Route>
              <Route path="/">
              {this.state.loading ? (
                <div className={styles.center}>
                  <CircularProgress />
                </div>
                ) : (
                  <JobList
                    jobs={this.state.jobs}
                    user={this.state.user}
                    selectJob={this.selectJob}
                  />)
              }
              </Route>
            </Switch>
          </Container>
          {/* <JobsMap location={{"latitude": "-37.8142176",
        "longitude": "144.9631608",}}></JobsMap> */}
        </div>
      </Router>
    )
  }
}

export default App;
