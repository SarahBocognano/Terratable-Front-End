import { useEffect, useState } from "react";
import "../../styles/admin/ListItems.css";
import ListItemProductType from "./ListItemProductType";
import ListItemProduct from "./ListItemProduct";
import ListItemProducer from "./ListItemProducer";
import ListItemRecipe from "./ListItemRecipe";

function ListItems(props) {
    /**
     * Le types d'item qui sont éditables
     * (fausses constante pour éviter les fautes de frappes)
     * /!\ a syncro avec <MainContainer> /!\
     */
    const TYPE_PRODUCT_TYPE = "productType";
    const TYPE_PRODUCER = "producer";
    const TYPE_PRODUCT = "product";

    /**
     * Liste des items passés par le parent
     */
    const list = props.list;

    /**
     * L'id de l'item en cours d'édition
     */
    const idSelected = props.idSelected;

    /**
     * Le type d'item en cours de listing
     */
    const itemType = props.itemType;

    /**
     * renders
     */
    if (itemType == TYPE_PRODUCT_TYPE) {
        /**
         * render Liste de Produit Types
         */
        return (
            <div className="ListItems">
                <ul className="list">
                    {list.map((item, index) => {
                        return (
                            <ListItemProductType
                                key={item._id}
                                selected={idSelected == item._id}
                                productType={item}
                                openEdit={props.openEdit}
                                removeItem={props.removeItem}
                                filterWith={props.filterProductByItem}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    } else if (itemType == TYPE_PRODUCT) {
        /**
         * render Liste de Produits
         */
        return (
            <div className="ListItems">
                <ul className="list">
                    {list.map((item, index) => {
                        return (
                            <ListItemProduct
                                key={item._id}
                                selected={idSelected == item._id}
                                product={item}
                                openEdit={props.openEdit}
                                removeItem={props.removeItem}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    } else if (itemType == TYPE_PRODUCER) {
        /**
         * render Liste de Producteur
         */
        return (
            <div className="ListItems">
                <ul className="list">
                    {list.map((item, index) => {
                        return (
                            <ListItemProducer
                                key={item._id}
                                selected={idSelected == item._id}
                                producer={item}
                                openEdit={props.openEdit}
                                removeItem={props.removeItem}
                                filterWith={props.filterProductByItem}
                                massUpdate={props.massUpdate}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    } else if (itemType == "recipes") {
        /**
         * render Liste de Recettes
         */
        return (
            <div className="ListItems">
                <ul className="list">
                    {list.map((item, index) => {
                        return (
                            <ListItemRecipe
                                key={item._id}
                                selected={idSelected == item._id}
                                recipe={item}
                                openEdit={props.openEdit}
                                removeItem={props.removeItem}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    } else {
        // wrong type to render list (or recipe todo)
        return null;
    }
}
export default ListItems;
