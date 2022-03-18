import React, { useState } from "react";
import "../styles/stylesCommande.scss";
import { BsBasket } from "react-icons/bs";
import { Link } from "react-router-dom";

function PageCommande() {
  const [value, setValue] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    adresseLivraison: "",
    adresseFacturation: "",
    sameBillAddress: "",
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    console.log(value);
  };
  const handleSubmit = (e) => {
    console.log("validate command form");
    <Link to="/paiement" />;
  };

  return (
    <div className="formCommande">
      <div className="titre">
        <h2>Informations à remplir pour valider la commande</h2>
      </div>
      <form method="POST" className="registerCommande">
        <div className="field">
          <label className="label">Nom </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="lastname"
            value={value.lastname}
          />
        </div>
        <div className="field">
          <label className="label">Prénom </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="firstname"
            value={value.firstname}
          />
        </div>
        <div className="field">
          <label className="label">Email </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="email"
            value={value.email}
          />
        </div>
        <div className="field">
          <label className="label">Téléphone </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="phone"
            value={value.phone}
          />
        </div>
        <div className="field">
          <label className="label">Adresse de livraison </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="adresseLivraison"
            value={value.adresseLivraison}
          />
        </div>
        <div className="field">
          <label className="label">Adresse de facturation </label>
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="adresseFacturation"
            value={value.adrFacturation}
          />
        </div>
      </form>
      {/*<div className="checkCom">
                    <input 
                        type="checkbox"
                        id="oui"
                        name="sameBillAddress"
                        onChange={handleChange}/>
                    <label htmlFor="oui">L'adresse de facturation est identique à l'adresse de livraison. </label>
                </div>*/}
      <div className="but">
        {/* <span><BsBasket /></span> */}
        <Link to={"/paiement"}>
          <button onClick={handleSubmit} className="btn" type="submit">
            <span>
              <BsBasket />
            </span>
            Commander
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PageCommande;
