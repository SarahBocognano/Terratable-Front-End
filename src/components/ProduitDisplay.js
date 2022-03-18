import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaTractor } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";

import "../styles/stylesProduit.css";

import slugify from "../utils/slugify"

function ProduitDisplay(props) {

    const productType = props.content

    const renderImage = () => {
        if (productType.image) {
            return (<img src={productType.image} className="imageProduit" />);
        }
        return (<img src={require('../assets/defaultImg.jpg')} className="defaultImg" />);
    }

    return (
        <div className='item produit' >
            {renderImage()}
            <div className='infosItem'>
                <h4>{productType.name}</h4>
                <ul className='listInfos'>
                    <li><ImPriceTags />{productType.priceAvg}€</li>
                    <li><FaTractor />{productType.producers.length}</li>
                </ul>
                <Link to={"/produits/" + slugify(productType.name) + "-" + productType._id}>
                    <button className="buttonDetailsProduit">
                        Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ProduitDisplay;