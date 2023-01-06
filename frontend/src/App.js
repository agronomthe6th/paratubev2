// import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'
// import './bootstrap.min.css'
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import NewVideo from './Pages/NewVideo';
import Video from './Pages/Video';
import Profile from './Pages/Profile'
import MyProfile from './Pages/MyProfile';
import EditProfile from './Pages/EditProfile';
import Catalog from './Pages/Catalog';
import SearchResults from './Pages/SearchResults';

function App() {
  return (

    <BrowserRouter>
      <Header />
      <main  className="main d-flex justify-content-center" style={{minHeight: '100%'}}>
          <Routes>
            <Route exact path='' element={ <Home/>}/>
            <Route exact path='/login' element={ <Login/>}/>
            <Route exact path='/register' element={ <Register/>}/>
            <Route exact path='/logout' element={ <Logout/>}/>
            <Route exact path='/new-video' element={ <NewVideo/>}/>
            <Route exact path='/video/:id' element={ <Video/>}/>
            <Route exact path='/profile/:id' element={<Profile/>} />
            <Route exact path='/my-profile' element={<MyProfile/>} />
            <Route exact path='/edit-profile' element={<EditProfile/>} />
            <Route exact path='/catalog' element={<Catalog/>} />
            <Route path='/search/:query' element={<SearchResults/>}/>
            {/* <Route exact path='/tests' element={<Tests/>} />
            <Route exact path='/tests2' element={<Tests2/>} /> */}
          </Routes>
      </main>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
