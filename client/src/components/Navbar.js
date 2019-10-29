import React from 'react';

import {
  withRouter
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GitHubIcon from '@material-ui/icons/GitHub';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  homeButton: {
    color: theme.palette.common.white
  },
  githubIcon: {
    marginLeft: '1rem'
  }
}));

function Navbar(props) {
  const classes = useStyles();

  const {user, updateUser} = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    updateUser(null);
    window.location = `${process.env.REACT_APP_API_BASE_URL}/auth/logout`;
  }

  const handleLogoClick = () => {
    props.history.push('/');
  }

  const handleProfile = () => {
    handleClose();
    props.history.push('/profile')
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button className={classes.homeButton} onClick={handleLogoClick}>Job Applications</Button>
          </Typography>
          {
            !user ?
              (<Button color="inherit" href={`${process.env.REACT_APP_API_BASE_URL}/auth/github`}>Login with <GitHubIcon className={classes.githubIcon} /></Button>)
            :
            (
              <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                { user && user.avatarURL ? <Avatar src={user.avatarURL} /> : <AccountCircle />}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
            )
            }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Navbar);