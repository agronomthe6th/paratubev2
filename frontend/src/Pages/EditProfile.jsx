import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Container, Row, Col, Card, Button, Form,Navbar ,Nav, NavDropdown,Dropdown,DropdownButton} from 'react-bootstrap'
import Note from '../Components/Note'
import { confirmAlert } from 'react-confirm-alert'; // Import
import { UpdateAuthStatus } from '../store/authentication/auth';
import Cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PlaceholderLoading from 'react-placeholder-loading'
import { fetchUserBytoken, userSelector } from '../store/UserSlice';
import { FetchVideosByUser, videoSelector } from '../store/VideoSlice';
import VideoWatchItemCard from '../Components/video/VideoWatchItemCard';

function EditProfile ({}) {
    const dispatch = useDispatch();
    const { username, uid, avatar, authenticated, userInfo } = useSelector(userSelector);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [notesWithoutFilter, setNotesWithoutFilter] = useState('');
    const uservideos = useSelector(state => state.video);
    const {videos, isFetching, isError, isSuccess} = uservideos;

    useEffect(() => {
     dispatch(fetchUserBytoken);
     dispatch(FetchVideosByUser({userId:uid}));
    }, [])
        
    const HandleChange = (e) => {
      // console.log(e);
      axios.get(
        `http://127.0.0.1:8000/api/?user=${uid}&ordering=${e}`
      )
      .then((response) => {
        setNotes(response.data.results) 
      })
      .catch((error) => {
        console.log(error);
      })
    }

    function EditProfile(){
      console.log(videos);
      // navigate('/edit-profile');
    }

    function HandleLogout(){
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              Cookie.remove('access_key');
              Cookie.remove('userInfo');
              dispatch(UpdateAuthStatus({ Access: false, userInfo: {}}));
              navigate('/');
            }
          },
          {
            label: 'No',
            onClick: () => alert('Click No')
          }
        ]
      });
    }

    function sortResult(e){
      e.preventDefault();
      var titleFilter = e.target.value;
      var filteredData=[...notesWithoutFilter].filter(
          function(el){
              return el.title.toString().toLowerCase().includes(
                  titleFilter.toString().trim().toLowerCase()
              )
          }
      );
      setNotes(filteredData)
  }

  // if (loading) {
  //   return (
  //     <Row className="d-flex justify-content-center m-4">
  //         <Col className='profile-col col-sm-10 col-md-8 col-lg-6'>
  //           <Card className="profile-card" filter-color="blue">
  //             <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
  //           </Card>
  //       </Col>
  //     </Row>
  //     )
  //   }
    return (
      <>
        { isFetching ? (
          <Row className="d-flex justify-content-center m-4">
            <Col className="col-sm-10 col-md-8 col-lg-6">
                <Card className="p-3">
                  <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                </Card>
            </Col>
          </Row>
        ) : isError ? (
          <h1>Error</h1>
        ) : (
          videos && (
          <Container >
          <Row className="d-flex justify-content-center">
            <Col className='profile-col col-sm-10 col-md-8 col-lg-6'>
              <Card className="profile-card border border-white">
              <div className="col d-flex justify-content-end" >
                <DropdownButton className="text-right" id="dropdown-item-button " style={{position: 'absolute'}} title=''>
                  <Dropdown.Item as="button"  onClick={HandleLogout}>Logout</Dropdown.Item>
                  <Dropdown.Item as="button"  onClick={EditProfile}>Edit profile</Dropdown.Item>
                </DropdownButton>
                </div>
                  <div className="page-header-image" src={avatar}></div>
                  <Card.Body className="profile-header" >
                  <Card.Img  src={avatar} alt="Card image" 
                    style={{width: '123px',
                      height: '123px',
                      overflow: 'hidden',
                      margin: '0 auto'}}/>
                    <h3 className="title">{username}</h3>
                    <Row className="stats-row">
                        <Col className='stats'>
                          <h2>1</h2>
                          <p>some</p>
                        </Col>
                        <Col className='stats'>
                          <h2>2</h2>
                          <p>random</p>
                        </Col>
                        <Col className='stats'>
                          <h2>3</h2>
                          <p>stats</p>
                        </Col>
                    </Row>
                  </Card.Body>
              </Card>
            </Col>
          </Row>

          <Navbar expand="lg" className='m-3'>
            <Container fluid>
                <Form className="d-flex">
              <div className="input-group mb-3">
                  <span className="input-group-text">title</span>
                  <input type="text" className="form-control"
                  onChange={sortResult}/>
              </div>

                </Form>
                <Nav
                  className="my-2 px-3 my-lg-0"
                  style={{ maxHeight: '100px' }}
                  navbarScroll
                >
                  <select  className="dropdown-me" onChange={(e) => HandleChange(e.target.value)}> 
                    <option value="">-</option>
                    <option value="id">id</option>
                    <option value="title">title</option>
                    <option value="description">description</option>
                  </select>
                </Nav>
            </Container>
          </Navbar>
          {isSuccess &&
            <Row className="d-flex justify-content-center"> 
              {videos.results.map(item => (
                <Col className="d-flex justify-content-center mb-3" key={item.id} sm={8} md={6} lg={4} xl ={3}>
                  <VideoWatchItemCard  key={item.id} video={item} />
                </Col>
              ))}
            </Row>
          }
        </Container>
      ))}
      </>
    )

}

export default EditProfile;