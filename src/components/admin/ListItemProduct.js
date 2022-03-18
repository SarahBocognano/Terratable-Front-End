
import DataContext from "../../utils/DataProvider";
import { useContext } from "react";

function ListItemProduct(props) {
    /**
     * L'item est il en cours d'édition
     */
    const isSelected = props.selected;

    /**
     * le produit à afficher dans la liste
     * product: {
     *      name: String,
     *      sku: String,            // Code produit (unique)
     *      image: String,          // Image en mode base64encode
     *      description: String,    // Description
     *      resume: String,         // Description courte
     *      productType: Object {           // Modifié pour contenir toutes les info du produit type
     *          _id
     *          name: String,
     *          image: String,          // Image en mode base64encode
     *          description: String,    // Description
     *          resume: String,         // Description courte
     *          unit: String,           // Unité de vente (Kg, Ltr, Piece)
     *      },
     *      enable: String,         // Visibilité sur le site YES / NO
     *      promote: String,        // Mis en avant ON / OFF
     *      producer: Object {              // Modifié pour contenir toutes les info du producer
     *          _id
     *          name: String,
     *          image: String,          // Image en mode base64encode
     *          description: String,    // Description
     *          resume: String,         // Description courte
     *          address: String,        // Code postal, ville
     *          created: {              // champs auto généré indiquant la date de création de l'objet
     *              type: Number,
     *              default: Date.now,
     *          },
     *      },
     *      price: Number,   // Prix moyen TTC
     *      created: {              // champs auto généré indiquant la date de création de l'objet
     *          type: Number,
     *          default: Date.now,
     *      },
     *  }
     */
    const product = props.product;

    /**
     * Verif de la cohérence des données recu
     * @todo check other fields
     */
    if (!product.name) {
        return null;
    }


    const dataProvider = useContext(DataContext);

    if (!product.producer || !product.producer.name) {
        product.producer = dataProvider.producers[0];
    }

    /**
     * Main render
     */
    return (
        <li className={isSelected ? "ListItem selected" : "ListItem"}>
            <div className="infosLeft">
                <span className="title">
                    {isSelected && <i className="fas fa-angle-right"></i>}{" "}
                    {product.enable != "false" ? (
                        <i className="fas fa-eye"></i>
                    ) : (
                        <i className="fas fa-eye-slash"></i>
                    )}{" "}
                    {product.enable != "false" && product.promote != "false" ? (
                        <i className="fas fa-home"></i>
                    ) : (
                        " "
                    )}{" "}
                    {product.name}
                </span>
                <span className="infosSmall">{product.producer.name}</span>
            </div>
            <div className="rightAction">
                <span
                    className="iconBtn action update"
                    onClick={() => props.openEdit(product._id)}
                >
                    <i className="fas fa-pencil-alt"></i>
                </span>
                <span
                    className="iconBtn action delete"
                    onClick={() => props.removeItem(product._id)}
                >
                    <i className="fas fa-trash-alt"></i>
                </span>
            </div>
        </li>
    );
}

export default ListItemProduct;
