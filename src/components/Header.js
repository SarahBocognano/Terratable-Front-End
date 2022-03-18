import { Link } from "react-router-dom";
import "../styles/header.scss";
import { useContext, useState, useEffect } from "react";
import DataContext from "../utils/DataProvider";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const links = [
    {
        to: "/produits",
        label: "Nos produits",
    },
    {
        to: "/recettes",
        label: "Nos recettes",
    },
    {
        to: "/producteurs",
        label: "Nos producteurs",
    },
];

function Header(props) {

    const dataProvider = useContext(DataContext);
    const renderAdminLink = () => {
        if (dataProvider.isLoggedIn && dataProvider.isLoggedIn.isAdmin === true) {
            return (
                <nav className="adminNav">
                    <ul>
                        <LinkElem hasClass to="/admin" label="Gestion de contenu" />
                        <LinkElem hasClass to="/admin/user" label="Créer un compte" />
                        <li className="deconnection" onClick={deconnexion}><AiOutlineLogout /></li>
                    </ul>
                </nav>
            )
        }
    }

    let navigate = useNavigate();
    const deconnexion = () => {
        localStorage.clear();
        dataProvider.setIsloggedIn({});
        navigate("/", { replace: true });
    }

    /**
     * Le nombre d'item dans le panier
     * et son prix total
     */
    const [cartNbProducts, setCartNbProducts] = useState(dataProvider.cart.nbProducts);
    const [cartPrice, setCartPrice] = useState(dataProvider.cart.price);

    /**
     * lors d'un changement de contenu du panier
     */
    useEffect(() => {
        const fnToRemoveCB = dataProvider.cart.removeOnUpdateCalback
        dataProvider.cart.onUpdate("header", () => {
            setCartNbProducts(dataProvider.cart.nbProducts);
            setCartPrice(dataProvider.cart.price);
        })
        return () => {
            fnToRemoveCB("header");
        };
    }, []);

    return (
        <header className="App-header">
            <div className="headerleft">
                <Link className="navbar-brand" to="/">
                    <img
                        src={require("../assets/logoNoir.png")}
                        className="logoImg"
                    />
                </Link>
            </div>
            <nav className="navbar">
                <ul>
                    <LinkElem hasClass to="/" label="Accueil" />
                    <li className="deroulant li">
                        <span>
                            Nos services
                        </span>
                        <ul className="sous">
                            {links.map((el, index) => (
                                <LinkElem
                                    key={index}
                                    to={el.to}
                                    label={el.label}
                                />
                            ))}
                        </ul>
                    </li>
                    <LinkElem hasClass to="/panier" label="Panier">
                        {cartNbProducts > 0 && (
                            <span className="cart-overview" title={cartPrice + "€"}>
                                <span className="cart-nb-products">
                                    {cartNbProducts}
                                </span>
                                <span className="cart-price">
                                    {cartPrice}€
                                </span>
                            </span>
                        )}
                    </LinkElem>
                </ul>
            </nav>
            {renderAdminLink()}
        </header>
    );
}

const LinkElem = ({ hasClass, to, label, children }) => {
    return (
        <li className={hasClass ? "li" : ""}>
            <Link to={to}>{label} {children}</Link>
        </li>
    );
};

export default Header;
