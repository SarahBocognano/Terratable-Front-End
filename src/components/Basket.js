import '../styles/basket.scss';
import BasketItem from './BasketItem';
import { BsBasket } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import DataContext from "../utils/DataProvider";

function Basket() {
    /**
     * Le contexte nous donnant accés aux données
     * @see App.js `const dataToShare = {...`
    */
    const dataProvider = useContext(DataContext);

    const validBasket = () => {
        console.log('Nice shot ! try again');
    }
    dataProvider.cart.checkAvailability(dataProvider.productsWithProducer);

    return (
        <div className="Basket">
            <div className="firstBlock">
            </div>
            <div className="basketContent">
                <h2>
                    Mon panier
                </h2>
                {dataProvider.cart.items.length
                    ? <BasketItemList cartInfos={dataProvider.cart} validBasket={validBasket} />
                    : <h2><i>-tristement vide-</i></h2>
                }
            </div>
        </div>
    );
}

const BasketTotalPrice = () => {
    const dataProvider = useContext(DataContext);
    // les info lors du chargement de la page
    const [cartInfos, setCartInfos] = useState(dataProvider.cart);

    useEffect(() => {
        const fnToRemoveCB = dataProvider.cart.removeOnUpdateCalback
        // on doit mettre à jour le prix total
        dataProvider.cart.onUpdate("BasketTotalPrice", () => {
            setCartInfos({ ...dataProvider.cart });
        })
        return () => {
            fnToRemoveCB("BasketTotalPrice");
        };
    }, []);

    return (
        <span>{cartInfos.price}€</span>
    );

}

const BasketItemList = ({ cartInfos, validBasket }) => {

    return (
        <div className="tab">
            <div className="tr">
                <div className="th">Produits</div>
                <div className="th">producteur</div>
                <div className="th">quantité</div>
                <div className="th">prix unitaire</div>
                <div className="th">total</div>
            </div>
            {
                cartInfos.items.map((item) => (
                    <BasketItem key={item._id} item={item} />
                ))
            }

            <div className="tr">
                <div className="th"></div>
                <div className="th"></div>
                <div className="th"></div>
                <div className="th">Total</div>
                <div className="th end">
                    <BasketTotalPrice></BasketTotalPrice>
                    <Link to="/panier/commande">
                        <div className="btnBasket" onClick={() => validBasket()}>
                            <span><BsBasket /></span>
                            Valider
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Basket;