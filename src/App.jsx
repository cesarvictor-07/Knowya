/* import { BrowserRouter, Routes, Route } from 'react-router-dom'; */
import './styles/global.css';

function App() {
  return (
    <>
      <main className='container'>
        <h1 className='logo'>Knowya</h1>
        <p> Conoce gente nueva</p>
        <button
          className="button-primary"
        >
          Descubrir personas
        </button>
      </main>
    </>
    /* <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={}></Route>
        </Routes>
      </main>
    </BrowserRouter> */
  );
}

export default App;
