import {Row, Col, Carousel, Stack, Card, Container, } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
// import Note from './Note'
import PlaceholderLoading from 'react-placeholder-loading'
// import VideoWatchItemCard from './video/VideoWatchItemCard'
import VideoWatchItemCard2 from './video/VideoWatchItemCard2'
import VideoWatchItemCard3 from './video/VideoWatchItemCard3'
// import '../bootstrap.min.css'

function ItemCarousel(props) {

    const [notes, setSlides] = useState({});
    const [loading, setloading] = useState(true);

    useEffect(()=> {

        setloading(true);
        // console.log(props.ordering);
        async function fetchSlides() {
            var ordering = ''
            if(props.ordering == 'popular') {
                ordering = '?ordering=id'
            } else if (props.ordering == 'newest'){
                ordering = '?ordering=-id'
            } else {
                ordering = ''
            }
            const response = await fetch(`http://127.0.0.1:8000/api/${ordering}`)
            const data = await response.json();
            // console.log(data.results)
            setSlides(data.results)
            setloading(false)
        }
        fetchSlides()
    }, [])

    if (!loading  || !notes) 
    return (
        <Container >
            <Row>
                <Col className="col-12 pb-5">
                    <Row>
                        <Col className="col-12 col-md-6  pb-md-3 pt-2  pr-md-1">
                            <Col className="h-100">
                                <VideoWatchItemCard2 video={notes[0]} />
                            </Col>
                        </Col>
                        <Col className="col-12 col-md-6 pt-2 pl-md-1 pb-md-3 m-0 ">
                            <Row className="h-100 p-0">
                                <Row className="mx-0 pb-3">
                                    <Col className="col-6 pr-1 pt-0">
                                        <VideoWatchItemCard3 video={notes[1]} />
                                    </Col>
                                    
                                    <Col className="col-6 pl-1 pt-0">
                                        <VideoWatchItemCard3 video={notes[2]} />
                                    </Col>
                                </Row>
                                <Row className="mt-auto mx-0">
                                    <Col className="col-6 pb-0 pr-1 ">
                                        <VideoWatchItemCard3 video={notes[3]} />
                                    </Col>
                                    
                                    <Col className="col-6 pb-0 pl-1 ">
                                        <VideoWatchItemCard3 video={notes[4]} />
                                    </Col>
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>  
    )
    {
        return (
            <Row>
                <Col className="col-12 pb-5">
                    <Row>
                        <Col className="col-12 col-md-6 pb-0 px-md-3 pt-2 pr-md-1">
                            <Card className=" p-1 rounded" style={{ width: '100%', height: "100%" }}>
                                <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                            </Card>
                        </Col>
                        {/* mb-lg-4 */}
                        <Col className="col-12 col-md-6 pt-2 pl-md-1 mb-3 ">
                            <Row className='d-flex'>
                                <Col className="col-6 pb-1 pt-0 pr-1">
                                    <Card className="mb-3 p-1 rounded " style={{ width: '100%' }}>
                                        <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                                    </Card>
                                </Col>
                                
                                <Col className="col-6 pl-1 pt-0">
                                    <Card className="mb-3 p-1 rounded " style={{ width: '100%' }}>
                                        <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                                    </Card>
                                </Col>
                                
                                <Col className="col-6 pb-0 pr-1 ">
                                    <Card className=" p-1 rounded " style={{ width: '100%' }}>
                                        <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                                    </Card>
                                </Col>
                                
                                <Col className="col-6 pb-0 pl-1 ">
                                    <Card className=" p-1 rounded " style={{ width: '100%' }}>
                                        <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default ItemCarousel
