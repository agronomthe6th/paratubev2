import React, { useEffect, useState } from 'react'
import { Form, Container,Dropdown, Image, TextField, Button, Checkbox, } from 'react-bootstrap'
import Cookie from 'js-cookie';
// import { UpdateAuthStatus } from '../store/authentication/auth';
import { Link, useNavigate } from 'react-router-dom';
import { UpdateAuthStatus } from '../store/authentication/auth';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { loginUser } from '../store/UserSlice';
import '../bootstrap.min.css'
function Login ({}) {
// const is_authenticated = useSelector(state => state.auth.user.is_authenticated);

const navigate = useNavigate();

const dispatch = useDispatch();
const propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const [state, setState] = useState({
    username: '',
    password: '',
    });

const onChange = e => setState({ ...state, [e.target.name]: e.target.value });

useEffect(() => {
    // if (is_authenticated) {
    //     // navigate('/');
    //   }
  });

function handleSubmit(event) {
    event.preventDefault();
    let data = {
        username: state.username,
        password: state.password,
    }
    dispatch(loginUser(data)).then(() => {
        navigate('/')
      })
      .catch((err) => {
        console.log(err);
      });
    // setState({password: ""});
    // axios.post('http://localhost:8000/api/token',{
    //     username: state.username,
    //     password: state.password,
    // }).then(function (res){
    //     // console.log(res.data.access);
    //     Cookie.set('access_key', res.data.access);
    //     // localStorage.setItem("access_key", res.data.access)
    //     axios.get(`http://localhost:8000/api/users/${JSON.parse(atob(Cookie.get('access_key').split('.')[1])).user_id}/`,{
    //         headers: {
    //             Authorization: `JWT ${Cookie.get('access_key')}`
    //             }
    //     }).then(function (res){
    //         console.log(res.data)
    //         Cookie.set('accessToken',  Cookie.get('access_key'));
    //         Cookie.set('access_token', Cookie.get('access_key'));
    //         Cookie.set('refreshToken', res.data.refresh);
    //         Cookie.set('user', res.data);
    //         Cookie.set('userInfo', JSON.stringify(res.data));
    //         dispatch(UpdateAuthStatus({
    //             Access: true,
    //             userInfo: JSON.stringify(res.data),
    //         }));
    //         // navigate('/');
    //         // var t = Cookie.get('userInfo')
    //     }).catch(function (err){
    //         console.log(err)
    //     })
    // }).catch(function (err){
    //     console.log(err)
    // })
}

return (
    <Container className=" p-0 m-5">
        <Row className="d-flex justify-content-center" id='login-user-form'>
            <Col md={12} lg={10} className="wrap d-md-flex " >
                {/* <Col className='col d-flex justify-content-center' id='login-user-image'>
                    <div className='login-user-image' id='login-user-image'/>
                </Col> */}
                <Col className='col ' id='login-wrap'>
                    <Card className="h-100 w-100 justify-content-center align-items-center wrap d-md-flex p-5 p-md-5">
                        <Form onSubmit={(e)=>handleSubmit(e)}>
                            <div class="w-100">
                                <h3 class="mb-4">Sign In</h3>
                            </div>
                            <Form.Group controlId="formBasicusername"  className='form-group p-1 ' >
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" required={true} placeholder="Enter username" name="username" value={state.username} onChange={onChange}/>           
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword" className='form-group p-1  mb-3' >
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required={true} placeholder="Password" name="password" value={state.password} onChange={onChange}/>
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicCheckbox" className="flex-start form-group p-1 " >
                                    <Form.Check type="checkbox" label="Remember me" />
                            </Form.Group> */}
                             <Form.Group  className='p-1'>
                                <Button variant="primary" type="submit" className="form-control btn btn-primary rounded submit px-3 mb-3" >
                                    Submit
                                </Button>
                            </Form.Group>
                            <Form.Group className="form-group d-md-flex mb-3" controlId="formBasicCheckbox">
		            	        <div className="w-50 text-left">
                                <Form.Check type="checkbox" label="Remember me" />
                                </div>
                                <div className="w-50 text-md-right">
                                    <a href="#">Forgot Password</a>
                                </div>
		                    </Form.Group>
                        </Form>
                        <p className="text-center">Not a member? <a data-toggle="tab" href="/register">Sign Up</a></p>
                    </Card>
                </Col>
            </Col>
        </Row>
    </Container>
    );
}

export default Login;
