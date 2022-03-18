import "../styles/recipesList.scss"
import { GiCook } from "react-icons/gi";
import { AiOutlinePieChart } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";
import Salad from "../assets/salad.jpg";
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import React from "react";

import DataContext from "../utils/DataProvider";

function RecipesList() {

    const dataProvider = useContext(DataContext);
    const [searchRecipe, setSearchRecipe] = useState("");
    const [recipes, setRecipes] = useState([]);


    const handleSearchRecipe = (e) => {
        let value = e.target.value.trim().toLowerCase();
        setSearchRecipe(value.length > 2 ? value : "");
    }

    useEffect(() => {

        if (!dataProvider.recipes.length) {
            return;
        }
        let filteredList = dataProvider.recipes.filter(
            (recipe) => (
                !searchRecipe
                || (
                    recipe.name
                    && recipe.name.toLowerCase().includes(searchRecipe)
                )
            )
        );
        setRecipes(filteredList);
    }, [dataProvider.recipes, searchRecipe]);

    console.log(searchRecipe + "coucou");

    return (
        <div className="recipeList">
            <div className="firstBlock">
                <h2>Une recette en tête?</h2>
                <div className="searchBarContainer">
                    <input type="search" id="search" onChange={handleSearchRecipe}></input>
                </div>
                <GiCook className="iconCook" />
            </div>
            <div className="recipeCards">

                {recipes.length > 0 ? recipes.map((recipe, index) => (
                    <div key={recipe._id} className="recipeCard">
                        <Link to="/recettes/id">
                            <img src={Salad} />
                            <div className="recipeDescription">
                                <p className="title text">{recipe.name}</p>
                                <div className="howManyChart">
                                    <AiOutlinePieChart className="iconPieChart subtitle text" />
                                    <p className="subtitle text">{recipe.shares}</p>
                                    <p className="subtitle text">|</p>
                                    <MdOutlineWatchLater className="iconPieChart title text" />
                                    <p className="subtitle text">{recipe.time} min</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
                    : <div><h2>Aucune recette ne correspond à votre recherche</h2></div>
                }
            </div>
        </div>
    )
}

export default RecipesList;