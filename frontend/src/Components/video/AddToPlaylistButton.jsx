import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Cookie from 'js-cookie';
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Add, Link, Lock, LockOpen, PlaylistAdd } from '@material-ui/icons';
import { userSelector } from '../../store/UserSlice';

const AddToPlaylistButton = (props) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deselected, setDeSelected] = useState([]);
  const [oldselected, setoldSelected] = useState([]);
  const [title, setTitle] = useState('');

  const [state, setState] = useState({
    title: '',});
  const [ready, setReady] = useState(false);
  const [data, setData] = useState([]);
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('Private');
  const { username, uid, avatar, authenticated } = useSelector(userSelector);
  let token = Cookie.get('access_token')
  var playlists = new Array();
  let video_id = props.videoId;
  const onChange = e => setState({ ...state, [e.target.name]: e.target.value });

  useEffect(() => {
    // console.log(props.videoId);
    const playlistIds = []
    axios
    .get(`http://localhost:8000/api/playlists/?author=${uid}`, {
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        "Content-type": "multipart/form-data",
        accept: 'application/json',
      },
    })
    .then((res) => {
      // console.log(res.data);
      res.data.forEach((playlist) => {
        playlist.videos.forEach((video) => {
          if (
            new String(video.video.id).valueOf() ===
            new String(video_id).valueOf()
          )
            playlistIds.push(playlist.id);
        });
      });

      // res.data[0].videos.forEach((video) => {
      //   if (            
      //   new String(video.video.id).valueOf() ===
      //   new String(vide_id).valueOf()) {
      //     playlistIds.push(res.data.id);
      //     console.log(video);
      //   }
      // })
      setReady(true);
      setData(res.data);
      // console.log(playlistIds);
      setSelected([...selected, ...playlistIds]);
      setoldSelected([...oldselected, ...playlistIds]);
    })
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (selected){
      selected.forEach((item) => {
        console.log(item);
        let body = {
            playlist_id: item,
            video_id: video_id,
        }
        axios.post('http://localhost:8000/api/playlists-video/', body, {
        headers: {
          Authorization: Cookie.get('access_token')
          ? `JWT ${Cookie.get('access_token')}`
          : null,
          "Content-type": "multipart/form-data",
          accept: 'application/json',
        }}, 
      )}
    )}
    if (deselected){
      deselected.forEach((item) => {
        console.log(item);
        axios.get(`http://localhost:8000/api/playlists-video/?video=${video_id}&playlist_id=${item}`,  {
          headers: {
            Authorization: Cookie.get('access_token')
            ? `JWT ${Cookie.get('access_token')}`
            : null,
            "Content-type": "multipart/form-data",
            accept: 'application/json',
          }}).then((res) => {
            console.log(res.data[0]);
            axios.delete(`http://localhost:8000/api/playlists-video/${res.data[0].id}/`, {
              headers: {
                Authorization: Cookie.get('access_token')
                ? `JWT ${Cookie.get('access_token')}`
                : null,
                "Content-type": "multipart/form-data",
                accept: 'application/json',
              }
            } 
          )
        }
      )}
    )}
  };

  const handleToggle = (id) => {
    console.log(selected);
    const newSelected = [...selected];
    const newDeSelected = [...deselected];
    if (!(selected.includes(id))) {
      console.log('selected');
      newSelected.push(id);
      setSelected(newSelected);
    } else {
      console.log('deselected');
      newSelected.pop(id);
      if (!(deselected.includes(id))) {
        newDeSelected.push(id);
      }
      // delete
      setDeSelected(newDeSelected);
      setSelected(newSelected);
    }
  };

  const handlePlaylistCreation = () =>{
    setOpen(false);
    let newPlaylist =  {
      title: state.title,
      author: uid,
      description: 'description',
      status: 'Private',
    }
    console.log(newPlaylist);
    axios
    .post('http://localhost:8000/api/playlists/',  newPlaylist, {
      headers: {
        Authorization: Cookie.get('access_token')
        ? `JWT ${Cookie.get('access_token')}`
        : null,
        "Content-type": "multipart/form-data",
        accept: 'application/json',
      },
    })
    .then((res) => {
      console.log(res);
      let body = {
        playlist_id: res.data.id,
        video_id: video_id,
        position: 2,
      }
      axios.post(`http://localhost:8000/api/playlists-video/`, body, {
        headers: {
          Authorization: Cookie.get('access_token')
          ? `JWT ${Cookie.get('access_token')}`
          : null,
          "Content-type": "multipart/form-data",
          accept: 'application/json',
        },
      })
      .then(resp => {
          // setreplaycomments(resp.data)
          console.log(resp.data);
      })
    })
    .catch((err) =>{
      console.log(err);
    })
  }

  const test = () => {
    console.log(selected);
    console.log(deselected);
    // axios.delete(`http://localhost:8000/api/playlists-video/4/`
    // , {
    // headers: {
    //   Authorization: Cookie.get('access_token')
    //   ? `JWT ${Cookie.get('access_token')}`
    //   : null,
    //   "Content-type": "multipart/form-data",
    //   accept: 'application/json',
    // }}) 
  }

  return (
    <>
    {/* <Button onClick={test}>test</Button> */}
      <Button startIcon={<PlaylistAdd />} onClick={handleOpen}>
        Save
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Save to...</DialogTitle>
        <List>
          {/* {status === 'loading' ? (
            <h1>loading...</h1>
          ) : status === 'error' ? (
            <h1>{error?.message || error}</h1>
          ) : (  */}
          {ready &&
              data.map(({ id, title, playlistStatus, videos }) => (
              <ListItem
                button
                onClick={() => {
                  handleToggle(id);
                }}
                key={id}>
                <ListItemIcon>

                  <Checkbox
                    checked={selected.indexOf(id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={title} />
                <ListItemSecondaryAction>
                  {playlistStatus === 'Public' ? (
                    <LockOpen />
                  ) : playlistStatus === 'Private' ? (
                    <Lock />
                  ) : (
                    <Link />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              ))
            }
          {/* )
          } */}
          <Divider />
          {!openForm ? (
            <ListItem
              button
              onClick={() => {
                setOpenForm(true);
              }}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create a new playlist" />
            </ListItem>
          ) : (
            <ListItem>
              <ListItemText>
                <TextField
                  label="Name"
                  placeholder="Enter playlist name..."
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 1, max: 150 } }}
                  name="title"
                  value={state.title} 
                  onChange={onChange}
                />
                {/* <PrivacySelectInput
                  value={privacyStatus}
                  handleChange={setPrivacyStatus}
                /> */}
                <Button onClick={handlePlaylistCreation}>Create</Button>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Dialog>
    </>
  );
}

export default AddToPlaylistButton;
