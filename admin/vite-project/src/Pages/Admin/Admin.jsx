import React from 'react';
import "./Admin.css";
import SideBar from '../../Components/sidebar/SideBar';
import { Routes,Route } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProducts from '../../Components/ListProducts/ListProducts';

const Admin = () => {
  return (
    <div>
      <div className="admin">
        <SideBar/>
        <Routes>
            <Route path='/addproduct' element={<AddProduct/>}></Route>
            <Route path='/listproducts' element={<ListProducts/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default Admin
