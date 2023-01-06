import {  useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, fetchUserBytoken } from '../store/UserSlice';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {Container, Row, Col, Card, Button, Form,FormControl,Navbar ,Nav, NavDropdown,Dropdown,DropdownButton} from 'react-bootstrap'
import { FetchAllVideos, FetchVideosByUser, SearchVideos, videoSelector } from '../store/VideoSlice';
import Link from '@mui/joy/Link';

const Header = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { username, authenticated, user } = useSelector(userSelector);
  const allvideos = useSelector(state => state.video);
  const {videos, isFetching, isError, isSuccess, next, totalpages, page, previous,} = allvideos;
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    dispatch(fetchUserBytoken({ token: Cookie.get('access_token') }));
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const Search = (e) => {
    //e
    e.preventDefault();
    // console.log('Search', searchQuery);
    if (window.location.href.includes('search')) {
      navigate(`/search/${searchQuery}`);
      window.location.reload(false);
    } else {
      navigate(`/search/${searchQuery}`);
    }
}

  return (
    <Navbar bg="dark" expand="lg">
      <div className="container-fluid px-4">
        <Navbar.Brand href="/"><span className='text-danger'>Para</span><span className='text-white'>tube</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className=" m-0">
            <Nav.Link href="/catalog">Catalog</Nav.Link>
            <Nav.Link href="/new-video">Upload</Nav.Link>
          </Nav>

          <Form className="d-flex w-100" onSubmit={Search}>
            <Form.Control
              onInput={(e) => {setSearchQuery(e.target.value)}} 
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <div className="input-group-append">
              <IconButton type="submit"  aria-label="search" >
                  <SearchIcon style={{ fill: "white" }} />
              </IconButton>
            </div>
          </Form>
          {/* <img src={user.avatar} className="img-fluid" alt="Responsive image"/> */}

          { authenticated ?
            <Box sx={{ flexGrow: 0, pl: 1 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={username} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                <MenuItem key='profile' >
                  <Link
                    href="/my-profile"
                    level="body3"
                    underline="none"
                    sx={{
                      fontWeight: 'md',
                      ml: 'auto',
                      color: 'text.secondary',
                      '&:hover': { color: 'danger.plainColor' },
                    }}
                  >
                    {username}
                  </Link>
                    {/* <Typography >my profile</Typography> */}
                </MenuItem>
                <MenuItem key='logout' >
                  <Typography >logout</Typography>
                </MenuItem>

              </Menu>
            </Box>
              :
            <Link href="/login">Login</Link>
          }
    
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default Header;
