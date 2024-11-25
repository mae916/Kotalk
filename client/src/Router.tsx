import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Main from './routes/Main';
import Join from './routes/Join';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
