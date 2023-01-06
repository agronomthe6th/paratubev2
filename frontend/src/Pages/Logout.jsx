import { UpdateAuthStatus } from '../store/authentication/auth';
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

function Logout() {

    const is_authenticated = useSelector((state) => state.auth.user.is_authenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // UseEffect
    useEffect(() => {
        if (is_authenticated) {
            Cookie.remove('access_key');
            Cookie.remove('userInfo');
            dispatch(UpdateAuthStatus({ Access: false, userInfo: {}}));
            navigate('/')
        }
    }, [])

  return (
    <div>
      
    </div>
  )
}

export default Logout
