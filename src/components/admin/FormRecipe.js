import React from "react";
import { useState, useEffect, useContext } from "react";
import "../../styles/admin/Form.css";
import { IoMdAddCircle } from 'react-icons/io';
import Select from 'react-select';

import DataContext from "../../utils/DataProvider";

function FormRecipe(props) {

    /**
     * Liste des "unités" possibles
     **/
    const unitList = ["Kg", "Ltr", "Piece", "100g"];

    /**
     * La recette à modifier (ou ajouté)
     */
    const itemToEdit = props.recipe;

    /**
     * Les données de la recette initalisée par les données fournis par le parent
     */
    const [formDatas, setFormDatas] = useState(itemToEdit);
    console.log(formDatas);


    /**
     * Changement d'un champ
     */
    const handleChange = (e) => {
        const newdatas = { ...formDatas, [e.target.name]: e.target.value };
        setFormDatas(newdatas);
    };

    const handleAddOne = async () => {
        const savedData = await props.addOne(formDatas, JSON.stringify(list));
        const newdatas = { ...formDatas, ...savedData };
        setFormDatas(newdatas);
    };

    const handleEditOne = async () => {
        const savedData = await props.editOne(formDatas)
        const newdatas = { ...formDatas, ...savedData };
        setFormDatas(newdatas);
    };


    /**
     * Affichage du bouton "Ajouter" ou "modifier"
     */
     const renderBtnTypeForm = (actionType) => {
        if (actionType == "add") {
            return (
                <button
                    className="btn add"
                    onClick={handleAddOne}
                >
                    Ajouter
                </button>
            );
        } else if (actionType == "modif") {
            return (
                <button
                    className="btn update"
                    onClick={handleEditOne}
                >
                    Modifier
                </button>
            );
        }
    };


    //On veut récupérer la liste des produits "type" ici
    //const products = [{id:1, value: 'tomates', label: "Tomates"}, {id:2, value: 'patates', label:"Patates"}];


    const dataProvider = useContext(DataContext);
    //On veut récupérer la liste des produits "type" ici
    const productTypes = dataProvider.productTypes;

    const [products, setProducts] = useState([])
    useEffect(() => {
        // demande de chargement de la liste de produits possible
        // sortie à avoir :
        // {id:1, value: 'tomates', label: "Tomates"}
        const newlist = dataProvider.productTypesFull.map(
            (productType) => { return { id: productType._id, value: productType.name, label: productType.name, }; }
        );
        console.log(newlist);
        console.log("liste", list);
        setProducts(newlist);

    }, [dataProvider.productTypes]);


    /**
     * Les données des ingrédients sélectionnés
     */
    const [ingredient, setIngredient] = useState({
        quantity: "",
        unit: "kg",
        ingredientName: "",
        id: "",
    });
    console.log(ingredient);
    const [list, setList] = useState([]);
    console.log(list);

    /**
    * Gestion des changements dans les champs unit et quantity
    */
    const handleChangeIngredient = (e) => {
        console.log(e);
        const newIngredient = { ...ingredient, [e.target.name]: e.target.value };
        setIngredient(newIngredient);
    };

    /**
    * Gestion des changements dans le composant Select
    */
    const handleChangeIngredientName = (selectedIngredient) => {
        const newIngredient = { ...ingredient, ingredientName: selectedIngredient.label, id: selectedIngredient.id };
        setIngredient(newIngredient);
    }

    /**
     * Ajout d'un ingrédient
     */
    const handleClick = (e) => {
        setList([...list, ingredient]);
    }

    /**
     * Suppression d'un ingrédient de la liste
     */
    function handleDeleteClick(ingredientToRemove) {
        const newList = list.filter((ingredient) => ingredient.id != ingredientToRemove.id);
        setList(newList);
    }

    return (
        <div className="AdminForm">
            <h2>
                {props.actionType == "add"
                    ? "Ajouter"
                    : "Modifier #" + itemToEdit.name}
            </h2>
            <input type="hidden" name="_id" id="_id" value={formDatas._id} />
            <div className="field">
                <input
                    placeholder="Nom de la recette"
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    value={formDatas.name}
                />
            </div>
            <div className="field dbl">
                <input
                    placeholder="Nombre de parts"
                    type="number"
                    name="shares"
                    id="shares"
                    onChange={handleChange}
                    value={formDatas.shares}
                />
                <input
                    placeholder="Temps de préparation en minutes"
                    type="number"
                    name="time"
                    id="time"
                    onChange={handleChange}
                    value={formDatas.time}
                />
            </div>
            <div className="field">
                <textarea
                    placeholder="Description"
                    type="text"
                    name="description"
                    id="description"
                    onChange={handleChange}
                    value={formDatas.description}
                ></textarea>
            </div>
            <div className="ingredients">
                <span className="subtitle">Ingrédients disponibles:</span>

                <div className="ingredientForm">
                    <Select
                        className="selectField"
                        name="ingredientName"
                        defaultValue={ingredient.ingredientName}
                        onChange={handleChangeIngredientName}
                        options={products}
                    />
                    <div className="field bld">
                        <input
                            className="quantity"
                            placeholder="Quantité"
                            type="number"
                            name="quantity"
                            id="quantity"
                            min='0'
                            step='0.1'
                            onChange={handleChangeIngredient}
                            value={formDatas.quantity}
                        />
                        <select
                            className="unit"
                            name="unit"
                            id="unit"
                            onChange={handleChangeIngredient}
                            value={ingredient.unit}
                        >
                            {unitList.map((unitPossible, index) => (
                                <option key={index} value={unitPossible}>
                                    {unitPossible}
                                </option>
                            ))}
                        </select>

                    </div>

                    
                    <span
                        className="iconAdd"
                        onClick={handleClick}
                    >
                        <IoMdAddCircle className="addButton" />
                    </span>
                </div>
                <div className="list">
                    <ul>
                        {list.map((ingredient) => {
                            return (
                                <div className="returnedList">
                                    <li className="li" key={ingredient.id}>{ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}</li>
                                    <span
                                        className="iconDelete"
                                        onClick={() => handleDeleteClick(ingredient)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </span>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {renderBtnTypeForm(props.actionType)}
        </div>

    );
}

export default FormRecipe;
