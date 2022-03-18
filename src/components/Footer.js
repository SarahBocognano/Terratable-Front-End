import { Link } from "react-router-dom";
import React from "react";
import "../styles/footer.scss"

import { AiFillFacebook, AiFillInstagram} from "react-icons/ai";

function Footer(props) {
    return (
        <footer >
    
            <div className="logoContainer">
                <Link to="/">
                    <img
                        src={require("../assets/logoBlanc.png")}
                        className="logoImg"
                    />
                </Link>
                <h2>Le chef, c'est vous</h2>
            </div>
            <div>
                <h3>Suivez-nous</h3>
                <AiFillFacebook className="iconFb"/>
                <AiFillInstagram className="iconFb"/>
            </div>
            <div>
                <h3>Catégories</h3>
                <ul >
                    <li className="liFooter"><Link to="/produits" >Nos produits</Link></li>
                    <li className="liFooter"><Link to="/recettes">Nos recettes</Link></li>
                    <li className="liFooter"><Link to="/producteurs">Nos producteurs</Link></li>
                    <li className="liFooter"><Link to="/">Le concept</Link></li>
                    <li className="liFooter"><Link to="/">Nos valeurs</Link></li>
                    <li className="liFooter"><Link to="/">Blog</Link></li>
                </ul>
            </div>
            <div>
                <h3>A propos</h3>
                    <ul>
                        <li className="liFooter"><Link to="/" >Devenir producteur</Link></li>
                        <li className="liFooter"><Link to="/">FAQ</Link></li>
                        <li className="liFooter"><Link to="/">Conditions générales</Link></li>
                        <li className="liFooter"><Link to="/">Mentions légales</Link></li>
                        <li className="liFooter"><Link to="/">Protections des données personnelles</Link></li>
                        <li className="liFooter"><Link to="/">Contactez-nous</Link></li>
                    </ul>
            </div>
        </footer>
    );
}

export default Footer;
