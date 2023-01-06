import React, { useEffect, useState } from 'react'
import {Row, Col, Card, Button} from 'react-bootstrap'
import ItemCarousel from '../Components/ItemCarousel'
import Note from '../Components/Note'

function Home({}) {

    return (
        
        <div className='row d-flex justify-content-center'>
            <Row >
                <ItemCarousel ordering='popular'/>
            </Row>
            {/* <Row>
                <ItemCarousel ordering='newest' />
            </Row> */}
        </div>
    )
}

export default Home
