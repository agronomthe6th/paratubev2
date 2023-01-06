import axios from "axios";
import { Card, Col, Row, Form, Button, Container } from "react-bootstrap";
import { useEffect, useState, useContext  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, fetchUserBytoken } from '../store/UserSlice';
//  console.log(getHtml)
const NewVideo = ()=>{
  const [msg, setMsg] = useState("")
  const [title, setTitle] = useState("")
  const [video, setvideo] = useState("")
  const [description, setDescription] = useState("")
  const [progress, setProgress] = useState('0')
  const dispatch = useDispatch();
  const { username, authenticated } = useSelector(userSelector);

  // const userInfo = useSelector((state) => state.auth.user.userInfo);
  // const {authenticated} = useSelector((state) => state.auth.user.{authenticated});
  const navigate = useNavigate();
  useEffect(() => {
    
  }, [])


  let options = {
    headers: {
      Authorization: `JWT ${Cookie.get('access_token')}`,
      "Content-type": "multipart/form-data",
      accept: 'application/json',
    },
    onUploadProgress: (progressEvent) => {
      const {loaded, total} = progressEvent;
      let percent = Math.floor( (loaded * 100) / total )
      console.log( `${loaded}kb of ${total}kb | ${percent}%` );

      if( percent < 100 ){
        setProgress(percent);
      }
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // var userid = JSON.parse(userInfo)['id'];
    // var username = JSON.parse(userInfo)['username'];
    let form_data = new FormData();
    let user;
    form_data.append('title', title);
    form_data.append('video', video, video.name);
    form_data.append('description', description);
    form_data.append('options', options)
    console.log(form_data);
    let url = `http://127.0.0.1:8000/api/videos/`;
    // console.log(Cookie.get('access_token'));
    axios
      .post(url, form_data,
        options,
        
      )
      .then((res) => {
        // console.log(res);
        setProgress(100);
        navigate(`/video/${res.data.id}`);
        // console.log(res.data);
      })
      .catch((err) =>{
        // setMsg(err)
        setTimeout(()=>{setMsg("")},4000)
        console.log(err);
      })
    }
  
    return (
      <>
        {
        {authenticated} ?
        
          <Container className=" p-0 m-5">
                      <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
            <Row className="d-flex justify-content-center">
              <Col className="col-sm-10 col-md-8 col-lg-6">
                <Card className="p-3">
                  <Form onSubmit={handleFormSubmit}>
                    <h3 style={{backgroundColor:'red',color:'white',textAlign:'center'}}>{msg}</h3>
                    <h3>Create a note</h3>
                    <div className="mb-3">
                      <label>Title</label>
                      <input
                        required type="text"
                        className="form-control"
                        placeholder="Enter Blog Title"
                        onChange={(e)=>setTitle(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>video </label>
                      <br/>
                      <input required type="file" onChange={(e)=>setvideo(e.target.files[0])} />
                    </div>
                    <div className="mb-3">
                      <label>Description</label>
                      <textarea className="form-control" rows="3" onChange={(e)=>setDescription(e.target.value)} ></textarea>
                    </div>
                    <div className="d-grid">
                      <Button type="submit" className="btn btn-primary">
                        Create
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Container>
          :
          <Row className="d-flex justify-content-center h-50 m-4">
            <Col className="col-sm-10 col-md-8 col-lg-6 h-100">
              <Card className="p-3 h-100 text-center" >
                <Card.Text className=' my-auto'>
                  <Link to="/login">
                    <button
                        className='btn btn-xl p-3 btn-outline-primary mx-2'
                        style={{ boxShadow: 'none' }}
                    >
                    Login to post
                    </button>
                    </Link>
                </Card.Text>
              </Card>
            </Col>
          </Row>
        } 
      </>
    );
  }


export default NewVideo;
