import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Home from './pages/Home';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import NotFound from './pages/NotFound';
import People from './pages/People';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Chat from './pages/Chat';

import ProtectedRoute from './components/ProtectedRoute';
import MatchManager from './components/matchManager';


function App() {
  return (
    <BrowserRouter>
      <MatchManager />
      <main>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<LogIn />}></Route>
          <Route path='/people' element={<ProtectedRoute><People /></ProtectedRoute>}></Route>
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
          <Route path='/chats' element={<ProtectedRoute><Chats /></ProtectedRoute>}></Route>
          <Route path='/chats/:idChat' element={<ProtectedRoute><Chat /></ProtectedRoute>}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
