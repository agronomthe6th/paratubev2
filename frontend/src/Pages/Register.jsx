import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
// import { register } from "../actions/auth";
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Container,Dropdown } from 'react-bootstrap'
import '../bootstrap.min.css'
import { signupUser } from '../store/UserSlice';
const Register = ()=>{
 
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    });

  const validateEmail = (email)=>{
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
    const dispatch = useDispatch();


  const handleFormSubmit = (e) => {
    setMsg('');
    e.preventDefault();

    if(state.password!==state.password2){
      setMsg("Passwords do not match!")
      setTimeout(()=>{setMsg("")},4000)}
    else if(validateEmail(state.email)==false){
      setMsg("Invalid Email")
      setTimeout(()=>{setMsg("")},4000)}
    else{
      const newUser = {
        username: state.username,
        email: state.email,
        password: state.password,
        password2: state.password2,
    }
      dispatch(signupUser(newUser)).then(() => {
        navigate('/login')
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
  
  const onChange = e => setState({ ...state, [e.target.name]: e.target.value });
    
    return (
      <Row className="d-flex justify-content-center">
        <Col className="">
          {/* col-sm-10 col-md-8 col-lg-6 */}
          <Card className="p-3">
          <h3 style={{backgroundColor:'red',color:'white',textAlign:'center'}}>{msg}</h3>

          <Form onSubmit={(e)=>handleFormSubmit(e)}>
              <Form.Group controlId="formBasicusername"  className='form-group p-1 ' >
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="username" required={true} placeholder="Enter username" name="username" value={state.username} onChange={onChange}/>           
              </Form.Group>
              <Form.Group controlId="formBasicemail"  className='form-group p-1 ' >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" required={true} placeholder="Enter email" name="email" value={state.email} onChange={onChange}/>           
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className='form-group p-1 ' >
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required={true} placeholder="Password" name="password" value={state.password} onChange={onChange}/>
              </Form.Group>
              <Form.Group controlId="formBasicPassword2" className='form-group p-1 ' >
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control type="password" required={true} placeholder="Confirm password" name="password2" value={state.password2} onChange={onChange}/>
              </Form.Group>
              <Button variant="primary" type="submit" className="btn-block btn btn-primary " >
                  Submit
              </Button>
              <Link className="px-2 py-2" style={{position: 'absolute'}}to={`/login`}>
                  Already have account?
              </Link>
          </Form>
          </Card>
        </Col>
      </Row>
    )
  }


export default Register
