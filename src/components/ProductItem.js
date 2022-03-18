import { useState, useContext } from 'react';
import DataContext from "../utils/DataProvider";

function ProductItem(props) {
    /**
     * Le contexte nous donnant accés aux données
     * @see App.js `const dataToShare = {...`
    */
    const dataProvider = useContext(DataContext);
    const CartProvider = dataProvider.cart;

    /**
     * LE produit
     */
    const product = props.product;

    /**
     * Maj du nombre voulu pour ce produit
     */
    const [numb, setNumb] = useState(CartProvider.getQuantity(product));

    const more = () => {
        setNumb(CartProvider.addXproduct(product, 1));
    }
    const less = () => {
        if (numb) {
            setNumb(CartProvider.removeXproduct(product, 1));
        }
    }

    /**
     * TODO mettre une vrai valeur
     */
    const distance = Math.floor(Math.random() * 100);


    return (
        <div className="line">
            <div className="inside">
                <div className="td">{product.name}</div>
                <div className="td">{product.producer.name}</div>
                <div className="td">{product.price}€ / {product.unit}</div>
                <div className="td">{distance} Km</div>
                <div className="td qty">
                    <span className="numb">
                        {numb}
                        <span className="more" onClick={() => more()}>
                            <i className="fas fa-plus-circle"></i>
                        </span>
                        <span className="less" onClick={() => less()}>
                            <i className="fas fa-minus-circle"></i>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}
export default ProductItem;