
import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import DataContext from "../utils/DataProvider";
import slugify from "../utils/slugify"

function BasketItem(props) {

    const dataProvider = useContext(DataContext);
    const CartProvider = dataProvider.cart;
    /**
     * le produit sauvegardé dans le panier
     */
    const [product, setProduct] = useState(props.item);

    /**
     * le produit est ses infos issu de la bdd
     */
    const productInfo = dataProvider.productsWithProducer.find((productInfo) =>
        product._id == productInfo._id
    );

    if (!productInfo) {
        setProduct({
            ...product, available: false
        })
    }

    /**
     * Maj du nombre voulu pour ce produit
     */
    const [numb, setNumb] = useState(CartProvider.getQuantity(productInfo));

    const more = () => {
        setNumb(CartProvider.addXproduct(productInfo, 1));
    }
    const less = () => {
        if (numb) {
            setNumb(CartProvider.removeXproduct(productInfo, 1));
        }
    }
    const [hiddeRow, setHiddeRow] = useState(false);
    const removeIt = () => {
        CartProvider.removeProduct(productInfo);
        setNumb(0);
        setHiddeRow(true);
    }

    // les info lors du chargement de la page
    const [productQantity, setProductQantity] = useState(product.quantity);

    useEffect(() => {
        const cbKey = "BasketItemQuantity-" + product.name + '-' + product._id;
        const fnToRemoveCB = dataProvider.cart.removeOnUpdateCalback;
        // on doit mettre à jour la quantité de ce produit
        // si il y en a encore
        dataProvider.cart.onUpdate(cbKey, () => {
            setProductQantity(dataProvider.cart.getQuantity(product));
        })
        return () => {
            fnToRemoveCB(cbKey);
        };
    }, []);

    const hasProductSameProductType = () => {
        const sameProducts = dataProvider.products.filter((productToCheck) => {
            return productToCheck.enable != "false"
                && productToCheck.productType == product.productTypeId
        });
        return sameProducts.length != 0;
    }

    if (hiddeRow) {
        return null;
    }

    return (
        <div className={productQantity == 0 ? "tr quantity0" : "tr"}>
            <div className={product.available ? "inside" : "inside unavailable"}>
                <div className="td">
                    <span className="productName">
                        {product.name}
                    </span>
                    {!product.available && (
                        <i className="productReplaceHint fas fa-exclamation-triangle"
                            title="produit non disponible)"></i>
                    )}
                    {!product.available && (
                        <div className="productReplace">
                            {hasProductSameProductType() && (
                                <Link to={"/produits/" + slugify(product.productTypeName) + "-" + product.productTypeId}>
                                    <button className="buttonDetailsProduit">
                                        trouver un remplacant
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                <div className="td">{product.producerName}</div>
                <div className="td">
                    <span className="productQantity">
                        {productQantity}
                    </span>
                </div>
                <div className="td">
                    <span className="productPrice">
                        {product.price}€ / {product.unit}
                    </span>
                </div>
                <div className="td total">
                    <span className="price">{productQantity * Number(product.price)}€</span>
                    <div className="right">
                        {product.available ? (
                            <span className="numb">
                                {numb}
                                <span className="more" onClick={() => more()}>
                                    <i className="fas fa-plus-circle"></i>
                                </span>
                                <span className="less" onClick={() => less()}>
                                    <i className="fas fa-minus-circle"></i>
                                </span>
                            </span>)
                            : (
                                <span className="numb">
                                    {numb}
                                </span>)
                        }
                        <span className="drop" onClick={() => removeIt()}>
                            <i className="fas fa-trash-alt"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BasketItem;