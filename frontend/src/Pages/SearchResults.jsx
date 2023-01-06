import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Card, Button, Form,Navbar ,Nav, NavDropdown,Dropdown,DropdownButton} from 'react-bootstrap'
import { FetchAllVideos, FetchVideosByUser, SearchVideos, videoSelector } from '../store/VideoSlice';
import VideoWatchItemCard from '../Components/video/VideoWatchItemCard';
import { useSelector, useDispatch } from 'react-redux';
import PlaceholderLoading from 'react-placeholder-loading'
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useParams } from 'react-router-dom'
import Pagination from '@mui/material/Pagination';

const SearchResults = () => {
    let { query } = useParams();
    const dispatch = useDispatch();
    const allvideos = useSelector(state => state.video);
    const {videos, isFetching, isError, isSuccess, next, totalpages, page, previous,} = allvideos;
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        console.log(query);
        setSearchQuery(query);
        dispatch(SearchVideos({searchQuery: query, page}));
    }, [])

    const Search = (e) => {
        window.history.replaceState(null, '', searchQuery);
        e.preventDefault();
        dispatch(SearchVideos({searchQuery, page}));
    }


    const fetchPage = (e, value) => {
        e.preventDefault();
        dispatch(SearchVideos({searchQuery, page: value }));
      };

    return (
        <>
            <Container className="m-3">
                <Row>
                    <form  onSubmit={Search}>
                        <div className="input-group">
                            <input type="text"
                                value={searchQuery}
                                onInput={(e) => {setSearchQuery(e.target.value)}} 
                                className="form-control" 
                                placeholder="Search this blog"/>
                            <div className="input-group-append">
                                    <IconButton type="submit"  aria-label="search">
                                        <SearchIcon style={{ fill: "blue" }} />
                                    </IconButton>
                            </div>
                        </div>
                    </form>
                </Row>
                { isFetching ? (
                    <>
                        <Row className="d-flex justify-content-center m-4">
                            <Col className="col-sm-10 col-md-8 col-lg-6">
                                <Card className="p-3">
                                <PlaceholderLoading shape="rect" width={'100%'} height={'100%'}/>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : isError ? (
                <h1>Error</h1>
                ) : (
                videos && (
                    <>
                        {isSuccess &&
                            <Row className="d-flex justify-content-center my-3"> 
                            {videos.results.map(item => (
                                <Col className="col-lg-3 col-md-4 col-sm-6 justify-content-center d-flex align-items-stretch mb-3" key={item.id} sm={8} md={6} lg={4} xl ={3}>
                                    <VideoWatchItemCard  key={item.id} video={item} />
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
        </>
    )
}

export default SearchResults;
