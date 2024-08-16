import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const AddProduct = async () => {
    try {
      let product = { ...productDetails };

      // Create FormData for image upload
      const formData = new FormData();
      formData.append("product", image);

      // Upload the image
      const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log("Upload Response Status:", uploadResponse.status);
      if (!uploadResponse.ok) {
        const errorDetails = await uploadResponse.text();
        console.log("Upload Response Error Details:", errorDetails);
        throw new Error(`Image upload failed: ${errorDetails}`);
      }

      const dataObj = await uploadResponse.json();

      if (dataObj.success) {
        product.image = dataObj.image_url;

        // Add the product
        const addProductResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/addproduct`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        console.log("Add Product Response Status:", addProductResponse.status);
        if (!addProductResponse.ok) {
          const errorDetails = await addProductResponse.text();
          console.log("Add Product Response Error Details:", errorDetails);
          throw new Error(`Product addition failed: ${errorDetails}`);
        }

        const addProductData = await addProductResponse.json();

        if (addProductData.success) {
          alert("Product Added Successfully");

          // Reset form
          setProductDetails({
            name: "",
            description: "",
            image: "",
            category: "women",
            new_price: "",
            old_price: "",
          });
          setImage(null);
        } else {
          alert("Failed to Add Product");
        }
      } else {
        throw new Error("Image Upload Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input
          type="text"
          name="description"
          value={productDetails.description}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="number"
            name="old_price"
            value={productDetails.old_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="number"
            name="new_price"
            value={productDetails.new_price}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select
          value={productDetails.category}
          name="category"
          className="add-product-selector"
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={!image ? upload_area : URL.createObjectURL(image)}
            alt=""
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          name="image"
          id="file-input"
          accept="image/*"
          hidden
        />
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>Error: {errorMessage}</p>
        </div>
      )}
      <button className="addproduct-btn" onClick={AddProduct}>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
