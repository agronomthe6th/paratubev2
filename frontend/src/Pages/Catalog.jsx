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
import { FetchAllVideos, FetchVideosByUser, videoSelector } from '../store/VideoSlice';
import VideoWatchItemCard3 from '../Components/video/VideoWatchItemCard3';
import Pagination from '@mui/material/Pagination';

function Catalog ({}) {
    const dispatch = useDispatch();
    const allvideos = useSelector(state => state.video);
    const {videos, isFetching, isError, isSuccess, next, totalpages, page, previous,} = allvideos;

    useEffect(() => {
        dispatch(FetchAllVideos({page}))
      }, [])



    const sortResult = (e) => {

    }

    const fetchPage = (e, value) => {
      e.preventDefault();
      console.log(value);
      dispatch(FetchAllVideos({page: value }));
    };

    return (
      <Container className="m-3">
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
            <>
                {isSuccess &&
                  <Row className="d-flex justify-content-center"> 
                    {videos.results.map(item => (
                      <Col className="col-lg-3 col-md-4 col-sm-6 justify-content-center d-flex align-items-stretch mb-3" key={item.id} sm={8} md={6} lg={4} xl ={3}>
                        <VideoWatchItemCard3  key={item.id} video={item} />
                      </Col>
                    ))}
                      { videos.count > 12 && 
                        <Pagination className="d-flex justify-content-center" count={totalpages} page={page} onChange={fetchPage} />
                      }
                  </Row>
                }
            </>
            ))}
      </Container>
    )
}


export default Catalog;