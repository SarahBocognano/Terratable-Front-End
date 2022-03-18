import { FaFileImport } from "react-icons/fa";

import { useState } from "react";
function ListItemProducer(props) {
    const [showModal, setShowModal] = useState(true);
    /**
     * L'item est il en cours d'édition
     */
    const isSelected = props.selected;

    /**
     * le producer à afficher dans la liste
     * producer: {
     *     name: String,
     *     image: String,          // Image en mode base64encode
     *     description: String,    // Description
     *     resume: String,         // Description courte
     *     address: String,        // Code postal, ville
     *     created: {              // champs auto généré indiquant la date de création de l'objet
     *         type: Number,
     *         default: Date.now,
     *     },
     *  }
     */
    const producer = props.producer;

    /**
     * Main render
     */

    return (
        <div>
            <li className={isSelected ? "ListItem selected" : "ListItem"}>
                <div className="infosLeft">
                    <span className="title">
                        {isSelected && <i className="fas fa-angle-right"></i>}
                        {producer.name}
                    </span>
                    <span className="infosSmall">{producer.address}</span>
                </div>
                <div className="rightAction">
                    <span
                        title="voir les produits"
                        className="iconBtn action filter"
                        onClick={() => props.filterWith("producer", producer._id)}
                    >
                        <i className="fas fa-list"></i>
                    </span>
                    <span className="iconBtn action update" onClick={() => props.openEdit(producer._id)}>
                        <i className="fas fa-pencil-alt"></i>
                    </span>
                    <span className="iconBtn action delete" onClick={() => props.removeItem(producer._id)}>
                        <i className="fas fa-trash-alt"></i>
                    </span>
                    <span className="iconBtn action update" onClick={() => props.massUpdate(producer._id)}>
                        <FaFileImport />
                    </span>
                </div>
            </li>
        </div>
    );
}

export default ListItemProducer;
