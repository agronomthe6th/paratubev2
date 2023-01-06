import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Container, Row, Col, Card, Button, Form,Navbar ,Nav, NavDropdown} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Note from '../Components/Note'
import Select, { components } from 'react-select';
import SearchBar from 'react-js-search';
import PlaceholderLoading from 'react-placeholder-loading'
import { userSelector } from '../store/UserSlice';
import VideoWatchItemCard from '../Components/video/VideoWatchItemCard';

function Profile ({}) {
    const navigate = useNavigate();
    const { id } = useParams()
    const dispatch = useDispatch();
    const { username, authenticated } = useSelector(userSelector);

    
    const [loading, setloading] = useState(true);
    const [profile, setProfile] = useState([]);
    const [notes, setNotes] = useState([]);
    const [state, setState] = useState({
      options: ['id','description','title'],
      selectedValue:'',
      labelName:'Users List'
    });
    const [inputText, setInputText] = useState("");
    const [notesWithoutFilter, setNotesWithoutFilter] = useState('');
    let cid = 'no';
    let inputHandler = (e) => {
      //convert input text to lower case
      var lowerCase = e.target.value.toLowerCase();
      setInputText(lowerCase);
    };

    useEffect(() => {
        setloading(true);
        if(authenticated){
          // cid = JSON.parse(userInfo)['id'];

        } 
        axios.get(
            `http://127.0.0.1:8000/api/users/${id}/`
        )
            .then((response) => {
              if (response.data.id == cid) {
                navigate('/my-profile');
              }
              setloading(false);
              setProfile(response.data);
              console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
          axios.get(
              `http://127.0.0.1:8000/api/videos/?author=${id}`
            )
              .then((response) => {
                setNotes(response.data.results) 
                setNotesWithoutFilter(response.data.results);
                // console.log(response.data.results);
              })
              .catch((error) => {
                console.log(error);
              })
          }, [])
        
        // Change Section i.e, Uploads to Videos etc...
    const HandleChange = (e) => {
      console.log(e);
      axios.get(
          `http://127.0.0.1:8000/api/videos/?author=${id}&ordering=${e}`
        )
          .then((response) => {
            setNotes(response.data.results) 
            console.log(response.data.results);
          })
          .catch((error) => {
            console.log(error);
          })
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
  if (loading) {
    return (
      <Row className="d-flex justify-content-center m-4">
        <Col className="col-sm-10 col-md-8 col-lg-6">
            <Card className="p-3">
              <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
            </Card>
        </Col>
      </Row>
    
      )
    }
    return (
      <Container >
        <Row className="d-flex justify-content-center">
          <Col className='profile-col col-sm-10 col-md-8 col-lg-6'>
            <Card className="profile-card" filter-color="blue">
                <div className="page-header-image" src={profile.avatar}></div>
                <Card.Body className="profile-header" >
                <Row className="justify-content-center d-flex justify-content-center">
                  <Card.Img  src={profile.avatar} alt="Card image" 
                  style={{width: '123px',
                          height: '123px',
                          overflow: 'hidden',
                          margin: '0 auto'}}/>
                </Row>
                  <h3 className="title d-flex justify-content-center">{profile.username}</h3>
                  <hr/>
                     <Col className='stats'>
                        <h2>{profile.description}</h2>
                      </Col>
                      <hr/>
                      <Col className='stats'>
                        <h2>5 {notes.count} videos uploaded</h2>
                      </Col>
                </Card.Body>
            </Card>
          </Col>
        </Row>

        <Navbar  expand="lg" className='m-3 mx-0 red '>
          <Container fluid className="border border-1">
              <Form className="d-flex">
            <div className="input-group my-3">
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
                  {/* <option value="id">id</option> */}
                  <option value="title">title</option>
                  <option value="description">description</option>
                </select>
              </Nav>
          </Container>
        </Navbar>


        <Row className="d-flex justify-content-center"> 
          {notes.map(item => (
            <Col className="col-lg-3 col-md-4 col-sm-6 justify-content-center d-flex align-items-stretch mb-3" key={item.id} sm={8} md={6} lg={4} xl ={3}>
              <VideoWatchItemCard  key={item.id} video={item} />
            </Col>
          ))}
        </Row>
      </Container>
    )

}

export default Profile;
