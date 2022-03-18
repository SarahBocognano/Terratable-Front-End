import React from "react";
import { useState } from "react";
import "../../styles/admin/Form.css";

function FormFarmer(props) {
    /**
     * Le producteur à modifier (ou ajouté)
     */
    const itemToEdit = props.producer;

    /**
     * Les données du producteur initalisé par les données fournis par le parent
     */
    const [formDatas, setFormDatas] = useState(itemToEdit);

    /**
     * Changement d'un champ
     */
    const handleChange = (e) => {
        const newdatas = { ...formDatas, [e.target.name]: e.target.value };
        setFormDatas(newdatas);
    };

    /**
     * Affichage du bouton "Ajouter" ou "modifier"
     */
    const renderBtnTypeForm = (actionType) => {
        if (actionType == "add") {
            return (
                <button className="btn add" onClick={() => props.addOne(formDatas)}>
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
            <div className="field dbl">
                <input
                    placeholder="Nom"
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    value={formDatas.name}
                />
                <input
                    placeholder="Addresse"
                    type="text"
                    name="address"
                    id="address"
                    onChange={handleChange}
                    value={formDatas.address}
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

export default FormFarmer;
