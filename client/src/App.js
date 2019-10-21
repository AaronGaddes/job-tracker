import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import JobList from './components/JobList/JobList';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        user: {
            skills: {
                HTML: true,
                CSS: true,
                JS: true
            }
        },
        jobs: [
            {
                title: 'Junior Software Developer',
                company: 'A Cloud Guru',
                logo: 'https://media.glassdoor.com/sqls/1434775/a-cloud-guru-squarelogo-1527500133047.png',
                progress: [
                    {
                        stage: 'Initial Application',
                        scheduledDate: null,
                        doneDate: '8-Oct',
                        notes: null
                    },
                    {
                        stage: 'Initial Call',
                        scheduledDate: null,
                        doneDate: null,
                        notes: null
                    }
                ],
                type: 'Full Time',
                experience: `At least 1 year of professional software development experience
                Used any OO language in production based systems Desirable`,
                coverletter: {
                    type: 'link',
                    content: 'Cover Letter - ACloudGuru',
                    link: 'https://drive.google.com/open?id=1Vp1KJV5Wo4njpXZVQg6Cl7JsvZvnh9dUZ8atF0dAFL8'
                },
                skills: [
                    'HTML','CSS','JS','HTML5','CSS3'
                ],
                address: 'Level 13/31 Queen St, Melbourne VIC 3000',
                renumeration: {
                    min: 70000,
                    max: 90000,
                    quoted: 80000,
                    period: 'anum'
                }
            }
        ]
    }
  }
  render(){
    return (
      <div className="App">
        <Navbar />
        <JobList
          jobs={this.state.jobs}
          userSkills={this.state.user.skills}
        />
      </div>
    )
  }
}

export default App;
