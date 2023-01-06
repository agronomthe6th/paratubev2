import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Card} from 'react-bootstrap'

function EditProfile ({}) {
    const navigate = useNavigate();
    const [imgState, setImgState] = useState({avatar:null, preview:null})
    const [desc, setDesc] = useState("")
    const [msg, setMsg] = useState("")

    const imageChange = (event) => {
        setImgState({avatar:event.target.files[0], preview:URL.createObjectURL(event.target.files[0])})
      }
    
    const userInfo = useSelector((state) => state.auth.user.userInfo);
    const is_authenticated = useSelector((state) => state.auth.user.is_authenticated);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        // console.log(channel_jsx_info)
        var id = JSON.parse(userInfo)['id'];
        axios.get(
            `http://127.0.0.1:8000/api/profiledetail/${id}`
        )
            .then((response) => {
                // console.log(response.data);
                setProfile(response.data) 
            })
            .catch((error) => {
                console.log(error);
            })
    }, [userInfo, is_authenticated])

    const handleFormSubmit = (e) => {
        e.preventDefault()
        let id = JSON.parse(userInfo)['id'];
        let form_data = new FormData();
        form_data.append("avatar", imgState.avatar, imgState.avatar.name);
        form_data.append("about", desc);
        // console.log(form_data);
        let url = `http://127.0.0.1:8000/api/updateprofile/${id}`;
        axios
        .put(url, form_data, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
            navigate('/my-profile');
            // console.log(res);
        })
        .catch((err) => {
          setMsg("Error");
          setTimeout(()=>{setMsg("")},4000);
          // console.log(err)
        });
      }

    return (
        <Row className="d-flex justify-content-center">
          <Col className="col-sm-10 col-md-8 col-lg-6">
            <Card className="p-3">
            <h3 style={{backgroundColor:'red',color:'white',textAlign:'center'}}>{msg}</h3>
              <form onSubmit={(e)=>handleFormSubmit(e)}>
                <div className="form-group p-1 ">
                <img src={profile.avatar} alt="" width="150" height="160"/>
                </div>
                <div className="form-group p-1 ">
                <label>Select avatar:</label>
                <input type="file" accept="avatar/*" onChange={imageChange} />
                </div>
                <div className="form-group p-1 ">
                  <label>Description:</label>
                  <input type="text" className="form-control" placeholder={profile.about} onChange={(e)=>setDesc(e.target.value)} />
                </div>
                <br/>
                <button type="submit" className="btn btn-primary ">Submit</button>
              </form>
            </Card>
          </Col>
        </Row>
      )
    }

export default EditProfile;
