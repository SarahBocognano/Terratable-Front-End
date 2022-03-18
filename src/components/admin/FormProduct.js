import React from "react";
import { useState, useContext } from "react";
import "../../styles/admin/Form.css";
import ToggleField from "./ToggleField";
import DataContext from "../../utils/DataProvider";

function FormProduct(props) {
    /**
     * La liste des producteurs possibles pour y associer notre produit
     */
    const dataProvider = useContext(DataContext);

    /**
     * Liste des "unités" possibles
     **/
    const unitList = props.unitList;

    /**
     * Le produit à modifier (ou ajouté)
     */
    const itemToEdit = props.product;

    /**
     * protection de champs vide
     */
    if (!itemToEdit.producer) {
        itemToEdit.producer = dataProvider.producers[0]._id;
    }
    if (!itemToEdit.productType) {
        itemToEdit.productType = dataProvider.productTypes[0]._id;
    }
    if (!itemToEdit.unit) {
        itemToEdit.unit = unitList[0];
    }

    /**
     * Les données du produit initalisé par les données fournis par le parent
     */
    const [formDatas, setFormDatas] = useState({
        ...itemToEdit,
        productType: itemToEdit.productType._id ?? itemToEdit.productType,
        producer: itemToEdit.producer._id ?? itemToEdit.producer,
    });

    /**
     * Changement d'un champ
     */
    const handleChange = (e) => {
        const fieldName = e.target.name;
        const newValue = e.target.value;
        const newdatas = { ...formDatas, [fieldName]: newValue };
        setFormDatas(newdatas);
        console.log(newdatas)
    };

    /**
     * Changement d'un champ par toggle (ex : "on/off", "auto/on/off")
     */
    const toggleOption = (fieldName, newValue) => {
        const newdatas = {
            ...formDatas,
            [fieldName]: newValue,
        };
        setFormDatas(newdatas);
    };

    const handleAddOne = async () => {
        const savedData = await props.addOne(formDatas)
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

    if (!dataProvider.productTypes.length) {
        return (
            <div className="AdminForm">
                <h2>
                    Ajout impossible
                </h2>
                <div className="field">
                    <b>Il faut déjà creer (au moins) un "ProduitType"</b>
                </div>
            </div>
        );
    } else if (!dataProvider.producers.length) {
        return (
            <div className="AdminForm">
                <h2>
                    Ajout impossible
                </h2>
                <div className="field">
                    <b>Il faut déjà creer (au moins) un "Producteur"</b>
                </div>
            </div>
        );
    }

    return (
        <div className="AdminForm">
            <h2>
                {props.actionType == "add"
                    ? "Ajouter"
                    : "Modifier #" + itemToEdit.sku}
            </h2>
            <input type="hidden" name="_id" id="_id" value={formDatas._id} />
            <div className="field">
                <select
                    name="producer"
                    id="producer"
                    onChange={handleChange}
                    defaultValue={formDatas.producer}
                >
                    {dataProvider.producers.map((producerPossible, index) => (
                        <option key={index} value={producerPossible._id}>
                            {producerPossible.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="field">
                <input
                    placeholder="Titre"
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    value={formDatas.name}
                />
            </div>
            <div className="field dbl">
                <input
                    placeholder="sku"
                    type="text"
                    name="sku"
                    id="sku"
                    onChange={handleChange}
                    value={formDatas.sku}
                />
                <select
                    name="productType"
                    id="productType"
                    onChange={handleChange}
                    value={formDatas.productType}
                >
                    {dataProvider.productTypes.map((productTypePossible, index) => (
                        <option key={index} value={productTypePossible._id}>
                            {productTypePossible.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="field dbl">
                <input
                    placeholder="Prix TTC"
                    type="text"
                    name="price"
                    id="price"
                    onChange={handleChange}
                    value={formDatas.price}
                />
                <select
                    name="unit"
                    id="unit"
                    onChange={handleChange}
                    value={formDatas.unit}
                >
                    {unitList.map((unitPossible, index) => (
                        <option key={index} value={unitPossible}>
                            {unitPossible}
                        </option>
                    ))}
                </select>
            </div>
            <div className="field">
                <input
                    placeholder="Description courte"
                    type="text"
                    name="resume"
                    id="resume"
                    onChange={handleChange}
                    value={formDatas.resume}
                />
            </div>
            <div className="field dbl">
                <ToggleField
                    title="Visibilité"
                    fieldName="enable"
                    value={formDatas.enable && formDatas.enable != "false"}
                    onChange={toggleOption}
                    items={[
                        {
                            value: true,
                            iconClassName: "fas fa-eye",
                            label: "Visible",
                        },
                        {
                            value: false,
                            iconClassName: "fas fa-eye-slash",
                            label: "Masqué",
                        },
                    ]}
                />
                <ToggleField
                    title="Mise en avant"
                    fieldName="promote"
                    value={formDatas.promote && formDatas.promote != "false"}
                    onChange={toggleOption}
                    items={[
                        {
                            value: true,
                            iconClassName: "fas fa-check",
                            label: "Mise en avant",
                        },
                        {
                            value: false,
                            iconClassName: "fas fa-times",
                            label: "Mise en avant",
                        },
                    ]}
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
            {renderBtnTypeForm(props.actionType)}
        </div>
    );
}

export default FormProduct;
