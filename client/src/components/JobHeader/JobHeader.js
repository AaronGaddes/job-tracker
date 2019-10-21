import React from 'react';
import './JobHeader.css';

export default function JobCard(props) {

    let {logo,title,company,type} = props;

    function getType(type) {
        switch(type) {
            case 'Full Time':
                return (<i className="job-type material-icons" title={type}>brightness_1</i>);
            case 'Part Time':
                return (<i className="job-type material-icons" title={type}>timelapse</i>);
            default:
                return (<i className="job-type material-icons" title={type}>brightness_1</i>);
        };
    };

    

    return(
        <div className="header">
            <img className="logo" src={logo}></img>
            <div className="title">{title}
                <div className="company">{company}</div>
            </div>
        {getType(type)}
        </div>
    )
}