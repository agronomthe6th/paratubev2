import React from 'react'
import {Col, Container, Row} from 'react-bootstrap'
// import { Twitter } from 'react-bootstrap-icons';
// import '../bootstrap.min.css'

function Footer() {
  return (
      <Row className='text-center text-white m-0' style={{ backgroundColor: '#f1f1f1' }}>
        <Row>
          <Col>
            <a
              className='btn btn-link btn-floating btn-lg text-dark m-1'
              href='#!'
              role='button'
              data-mdb-ripple-color='dark'>
              {/* <Twitter/> */}
            </a>
          </Col>
          <Col className="d-flex d-flex align-items-center">
           <button type="button" className="btn btn-primary">Example button</button>
          </Col>
        </Row>
    </Row>
  )
}
export default Footer;
