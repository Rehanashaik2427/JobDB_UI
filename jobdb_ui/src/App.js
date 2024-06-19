

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Candidates from './pages/Candidates';
import About from './pages/About';
import JobboxCompanyPage from './pages/JobboxCompanyPage';
import EachCompanyPage from './pages/EachCompanyPage';

import './App.css';
import AppRoutes from './AppRoutes';




function App() {
  return (
    <div className="App">

   <Router basename="/" >
                <Routes>
                    <Route path='/' element={< Home />} />
                    <Route path='/Signin' element={< Signin />} />
                    <Route path='/candidates' element={< Candidates />} />
                    <Route path='/About' element={< About />} />
                    <Route path='/jobboxCompanyPage' element={< JobboxCompanyPage />} />
             
                    <Route path='/eachCompanyPage' element={< EachCompanyPage />} />

                </Routes>

            </Router>


      <AppRoutes />

    </div>

  );
}

export default App;
