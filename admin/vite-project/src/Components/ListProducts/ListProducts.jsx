import React, { useEffect, useState } from 'react'
import "./ListProducts.css"

const ListProducts = () => {

  const [allProducts,setAllProducts]=useState([]);
  
  const fetchInfo=async()=>{
    await fetch("http://localhost:4000/allproducts")
    .then((resp)=>resp.json()).
    then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_Product=async (id) =>{
    await fetch("http://localhost:4000/removeproduct",{
      method:"POST",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
      },
      body:JSON.stringify({id:id}),
    })
    await fetchInfo();
  }

  return (
    <div className='listproducts'>
      <h1>All products list</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr/>
        {allProducts.map((product,index)=>{
          return <>
          <div className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <i onClick={()=>{remove_Product(product.id)}} className="fa-solid fa-trash-can "></i>
          </div>
          <hr/>
          </>
        })}
      </div>
    </div>
  )
}

export default ListProducts
