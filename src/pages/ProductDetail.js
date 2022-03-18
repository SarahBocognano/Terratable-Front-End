import '../styles/productDetail.scss';
import { FaTractor } from "react-icons/fa";
import ProductItem from '../components/ProductItem';
import { BsBasket } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useContext } from "react";
import NotFoundPage from "./NotFoundPage";
import DataContext from "../utils/DataProvider";

function ProductDetail() {
    /**
     * Le contexte nous donnant accés aux données
     * @see App.js `const dataToShare = {...`
     */
    const dataProvider = useContext(DataContext);

    /**
     * Le parametre dans l'url
     */
    const { slugNid } = useParams();

    /**
     * Recherche de l'id (apres le slug)
     */
    let productTypeId = slugNid;
    if (slugNid.indexOf("-") != -1 && slugNid.indexOf("-") != slugNid.length) {
        const parts = slugNid.split('-');
        // on garde la derniere partie (après le slug)
        productTypeId = parts[parts.length - 1];
    }

    /**
     * les données du productType
     */
    const productType = dataProvider.productTypesFull.find(
        (productType) => productType._id == productTypeId
    );

    if (!productType) {
        // product type not found
        return <NotFoundPage />;
    }

    return (
        <div className="ProductDetail">
            <div className="FarmerBloc">
                <div className="farmerImage">
                    <img className="defaultImg" src={require('../assets/logoNoir.png')} />
                </div>
                <div className="farmerText">
                    <h2>{productType.name}</h2>
                    <p>
                        {productType.description}
                    </p>
                    <span className="localization">
                        <FaTractor className="tracteur" />
                        <span className="farmerCity">{productType.producers.length} producteurs</span>
                    </span>
                </div>
            </div>

            <div className="listProduitsParProd">
                <div className="line">
                    <div className="inside">
                        <div className="th">Nom</div>
                        <div className="th">Producteur</div>
                        <div className="th">Prix TTC</div>
                        <div className="th">Distance</div>
                        <div className="th qty">Quantité</div>
                    </div>
                </div>
                {productType.products.map((product, index) => (
                    <ProductItem key={index} product={product} />
                ))}
                <div className="btnLine">
                    <Link to="/panier/">
                        <div className="btnValidate">
                            <span><BsBasket /></span>Valider
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;