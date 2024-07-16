import React from 'react'
import "./SideBar.css"
import {Link} from "react-router-dom"

const SideBar = () => {
  return (
    <div className='sidebar'>
        <Link to={"/addproduct"} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <i class="fa-solid fa-plus"/>
                <p>Add Product</p>
            </div> 
        </Link>
        <Link to={"/listproducts"} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <i class="fa-solid fa-list-ul"/>
                <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default SideBar
