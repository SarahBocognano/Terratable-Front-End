import React from "react";
import { useState } from "react";
import "../styles/farmerBloc.scss";
import { Link } from "react-router-dom";
import slugify from "../utils/slugify"

function FarmerBloc(props) {
    /**
     * LE producteur
     * {
     *      name: String,
     *      image: String,          // Image en mode base64encode
     *      description: String,    // Description
     *      resume: String,         // Description courte
     *      address: String,        // Code postal, ville
     *      created: {              // champs auto généré indiquant la date de création de l'objet
     *          type: Number,
     *          default: Date.now,
     *      },
     * }
     */
    const [producerDatas, setProducer] = useState(props.producer);

    /**
     * Main render
     */
    return (
        <div className="FarmerBloc">
            <div className="farmerText">
                <Link to={"/producteurs/" + slugify(producerDatas.name) + "-" + producerDatas._id}>
                    <h2>{producerDatas.name}</h2>
                </Link>
                <p>{producerDatas.description}</p>
                <span className="localization">
                    <i className="fas fa-map-marker-alt"></i>
                    <span className="farmerCity">{producerDatas.address}</span>
                </span>
            </div>
            <div className="farmerImage">
                {false && producerDatas.image ? (
                    <img className="defaultImg" src={producerDatas.image} />
                ) : (
                    <img
                        className="defaultImg"
                        src={require("../assets/logoNoir.png")}
                    />
                )}
            </div>
        </div>
    );
}

export default FarmerBloc;
