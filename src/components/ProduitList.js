import { useEffect, useState } from 'react';
import ProduitDisplay from "./ProduitDisplay";
import "../styles/stylesProduit.css";
import { GiFruitBowl } from "react-icons/gi";
import { FaCarrot } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

import { useContext } from "react";
import DataContext from "../utils/DataProvider";

function ProduitList() {

    const dataProvider = useContext(DataContext);
    const [categorie, setCategorie] = useState("");
    const [searchProd, setSearchProd] = useState("");
    const [produitTypes, setProduitTypes] = useState(dataProvider.productTypesFull);


    const handleChangeCategorie = (e) => {
        const value = e.target.value;
        setCategorie(value);
    };
    const handleSearchProduit = (e) => {
        let value = e.target.value.trim().toLowerCase();
        setSearchProd(value.length > 2 ? value : "");
    }
    const handleSetCategorie = (value) => {
        
        setCategorie(value);
    };

    useEffect(() => {
        // filtrage de la liste complete des products
        // pour ne concerver que les "visible" ET "ceux correspondant au filtre"

        if (!dataProvider.productTypesFull.length) {
            return;
        }
        let filteredList = dataProvider.productTypesFull.filter(
            (productType) =>
                productType.enable != "false"
                && (!categorie || productType.categorie == categorie)
                && (!searchProd || productType.name.toLowerCase().includes(searchProd))
        );
        setProduitTypes(filteredList);
    }, [dataProvider.productTypesFull, categorie, searchProd]);


    return (
        <div className="ProduitsList">
            <div className="firstBlock">
                <h2>Que souhaitez-vous?</h2>
                <div className="searchBarContainer">
                    <input type="search" id="search" onChange={handleSearchProduit} ></input>
                </div>
                <div className='icons'>
                    <div onClick={() => handleSetCategorie("fruits")}> 
                        <GiFruitBowl className={categorie=="fruits" ? "iconFb flop" : "iconFb" } />
                        <h5>Fruits</h5></div>
                    <div onClick={() => handleSetCategorie("légumes")}  >
                        < FaCarrot  className={categorie=="légumes" ? "iconFb flop" : "iconFb"}/>
                        <h5>Legumes</h5></div>
                    <div onClick={() => handleSetCategorie("autre")}  >
                        < BsThreeDots className={categorie=="autre" ? "iconFb flop" : "iconFb"} />
                        <h5>Autres</h5></div>
                </div>
            </div>

            <div className="productsListWrapper">
                <div className="topList">
                    <h2>
                        Nos produits
                        {produitTypes.length>0 && "  ("+ produitTypes.length+")"}
                    </h2>
                    <div className='categorieProduit'>
                        <label htmlFor="categorie"></label>
                        <select onChange={handleChangeCategorie} value={categorie}>
                            <option value="">Tous les produits</option>
                            <option value="légumes">Légumes</option>
                            <option value="fruits">Fruits</option>
                            <option value="autre">Autres produits</option>
                        </select>
                    </div>
                </div>
                <div className='listProduits'>
                    {produitTypes.length > 0
                        ? produitTypes.map((produitData, index) => (
                            <ProduitDisplay key={index} content={produitData}></ProduitDisplay>))
                        : <div><h2>Aucun produit ne correspond à votre recherche</h2></div>
                    }
                </div>
            </div>
        </div>
    )
}
export default ProduitList;