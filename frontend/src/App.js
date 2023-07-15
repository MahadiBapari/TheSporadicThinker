
import Home from './pages/home/Home';
import Blogs from './pages/blogs/Blogs';
import Contact from './pages/Contact';
import Docs from './pages/Docs';
import About from './pages/About';
import Error from './pages/Error';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArticleDetailPage from './pages/articleDetail/ArticleDetail';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/id" element={<ArticleDetailPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<Error />} />
        </Routes> 
      </BrowserRouter>
    </div>
  );
}

export default App;
