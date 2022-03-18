function ListItemProductType(props) {
    /**
     * L'item est il en cours d'édition
     */
    const isSelected = props.selected;

    /**
     * le produit type à afficher dans la liste
     * productType: {
     *      name: String,
     *      image: String,          // Image en mode base64encode
     *      description: String,    // Description
     *      resume: String,         // Description courte
     *      categorie: String,      // Catégorie (fruits, légumes, autre)
     *      enable: String,         // Visibilité sur le site YES / NO
     *      promote: String,        // Mis en avant ON / OFF
     *      created: {              // champs auto généré indiquant la date de création de l'objet
     *          type: Number,
     *          default: Date.now,
     *      },
     *  }
     */
    const productType = props.productType;

    /**
     * Verif de la cohérence des données recu
     * @todo check other fields
     */
    if (!productType.name) {
        return null;
    }

    /**
     * Main render
     */
    return (
        <li className={isSelected ? "ListItem selected" : "ListItem"}>
            <div className="infosLeft">
                <span className="title">
                    {isSelected && <i className="fas fa-angle-right"></i>}{" "}
                    {productType.enable != "false" ? (
                        <i className="fas fa-eye"></i>
                    ) : (
                        <i className="fas fa-eye-slash"></i>
                    )}{" "}
                    {productType.enable != "false" && productType.promote != "false" ? (
                        <i className="fas fa-home"></i>
                    ) : (
                        " "
                    )}{" "}
                    {productType.name}
                </span>
                <span className="infosSmall">{productType.resume}</span>
            </div>
            <div className="rightAction">
                <span
                    title="voir les produits"
                    className="iconBtn action filter"
                    onClick={() => props.filterWith("productType", productType._id)}
                >
                    <i className="fas fa-list"></i>
                </span>
                <span
                    className="iconBtn action update"
                    onClick={() => props.openEdit(productType._id)}
                >
                    <i className="fas fa-pencil-alt"></i>
                </span>
                <span
                    className="iconBtn action delete"
                    onClick={() => props.removeItem(productType._id)}
                >
                    <i className="fas fa-trash-alt"></i>
                </span>
            </div>
        </li>
    );
}

export default ListItemProductType;
