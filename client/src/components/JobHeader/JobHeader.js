import React from 'react';
import './JobHeader.css';
import BusinessIcon from '@material-ui/icons/Business';

export default function JobHeader(props) {

    let {title,company,type} = props;

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
            {company.logoURL == '' ? <span className="logo"><BusinessIcon /></span> :<img className="logo" src={company.logoURL}></img>}
            <div className="title">{title}
                <div className="company">{company.name}</div>
            </div>
        {getType(type)}
        </div>
    )
}