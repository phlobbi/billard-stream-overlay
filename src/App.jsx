import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Overlay from './Overlay';
import Control from './Control';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overlay />} />
        <Route path="/control" element={<Control />} />
      </Routes>
    </BrowserRouter>
  );
}
