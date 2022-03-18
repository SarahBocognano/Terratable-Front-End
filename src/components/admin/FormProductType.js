import React from "react";
import { useState, useContext } from "react";
import "../../styles/admin/Form.css";
import ToggleField from "./ToggleField";
import DataContext from "../../utils/DataProvider";

function FormProductType(props) {
    /**
     * La liste des producteurs possibles pour y associer notre produit
     */
    const dataProvider = useContext(DataContext);

    /**
     * Liste des "categorie" possibles
     **/
    const categorieList = props.categorieList;

    /**
     * Le produit type à modifier (ou ajouter)
     */
    const itemToEdit = props.productType;
    
    /**
     * Les données du produit initalisé par les données fournis par le parent
     */
    const [formDatas, setFormDatas] = useState({
        ...itemToEdit,
    });

    /**
     * Changement d'un champ
     */
    const handleChange = (e) => {
        const newdatas = { ...formDatas, [e.target.name]: e.target.value };
        setFormDatas(newdatas);
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

    /**
     * Affichage du bouton "Ajouter" ou "modifier"
     */
    const renderBtnTypeForm = (actionType) => {
        if (actionType == "add") {
            return (
                <button
                    className="btn add"
                    onClick={() => props.addOne(formDatas)}
                >
                    Ajouter
                </button>
            );
        } else if (actionType == "modif") {
            return (
                <button
                    className="btn update"
                    onClick={() => props.editOne(formDatas)}
                >
                    Modifier
                </button>
            );
        }
    };

    return (
        <div className="AdminForm">
            <h2>
                {props.actionType == "add"
                    ? "Ajouter"
                    : "Modifier #" + itemToEdit.name}
            </h2>
            <input type="hidden" name="_id" id="_id" value={formDatas._id} />
            <div className="field">
                <select
                    name="categorie"
                    id="categorie"
                    onChange={handleChange}
                    value={formDatas.categorie}
                >
                    {categorieList.map((categoriePossible, index) => (
                        <option key={index} value={categoriePossible}>
                            {categoriePossible}
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

export default FormProductType;
