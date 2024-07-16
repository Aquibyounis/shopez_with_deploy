import React, { useState } from 'react';
import "./AddProduct.css";
import upload_image from "../../assets/upload.webp";

const AddProduct = () => {
    const [image, setImage] = useState(false);
     
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "Womens",
        new_price: "",
        old_price: ""
    });

    const Add_Product=async ()=>{
        console.log(productDetails);
        let responseData;
        let product=productDetails;

        let formData=new FormData();
        formData.append("product",image);

        await fetch("http://localhost:4000/upload",{
            method:"POST",
            headers:{
                Accept:"Application/json"
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});

        if (responseData){
            product.image=responseData.image_url;
            console.log(product);
            await fetch("http://localhost:4000/addproduct",{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product added"):alert("Failed")
            })
        }
    }

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className='addproduct'>
            <div className="addproduct-item-field">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here' required />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-item-field">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Old price' required />
                </div>
                <div className="addproduct-item-field">
                    <p>Offer price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='New price' required />
                </div>
            </div>
            <div className="addproduct-item-field">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector' required>
                    <option value='Womens'>Womens</option>
                    <option value='Mens'>Mens</option>
                    <option value='Kids'>Kids</option>
                    <option value='Electronics'>Electronics</option>
                    <option value='Furnitures'>Furnitures</option>
                </select>
            </div>
            <div className="addproduct-item-field">
                <label htmlFor='file-input' required>
                    <img src={image ? URL.createObjectURL(image) : upload_image} alt='' className='image' />
                </label>
                <input onChange={imageHandler} type='file' name='image' id='file-input' hidden />
            </div>
            <button className='addproduct-btn' onClick={()=>{Add_Product()}}>ADD</button>
        </div>
    );
}

export default AddProduct;
