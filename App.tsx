import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GetForm } from './components/GetForm';
import { ManagerView } from "./views/Manager";
import { Layout } from './components/Layout';
import axios from 'axios'
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<GetForm onSave={async (values: any) => {
            await axios.post('http://localhost:5000/', values)
          }} />} />
          <Route path="/manage" element={<ManagerView  />} />
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )

}

export default App;