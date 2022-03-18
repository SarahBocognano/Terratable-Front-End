import "../../styles/admin/MainContainer.css";

import ListItems from "./ListItems";
import FormProductType from "./FormProductType";
import FormProduct from "./FormProduct";
import FormProducer from "./FormProducer";
import FormRecipe from "./FormRecipe";

import { useState, useEffect, useReducer, useContext } from "react";
import { Modal, Toast } from "react-bootstrap";
import BackEnd from "../../utils/ApiWrapper";
import DataContext from "../../utils/DataProvider";
import FilterProducts from "./FilterProducts";
import FilterProductTypes from "./FilterProductTypes";
import { MdBreakfastDining } from "react-icons/md";
import Producers from "../../pages/Producers";

function MainContainer(props) {
    /* Message suite a une requete*/
    const [message, setMessage] = useState(null);

    /**
     * Le types d'item qui sont éditables
     * (fausses constante pour éviter les fautes de frappes)
     * /!\ a syncro avec <ListItems> /!\
     */
    const TYPE_PRODUCT_TYPE = "productType";
    const TYPE_PRODUCER = "producer";
    const TYPE_PRODUCT = "product";
    const TYPE_RECIPE = "recipes";
    // fake type to avaoid reset newly setted filters
    const TYPE_PRODUCT_FILTERED = "productFiltered";

    const TYPES_LABELS = [
        {
            key: TYPE_PRODUCT_TYPE,
            label: "Categories",
        },
        {
            key: TYPE_PRODUCER,
            label: "Producteurs",
        },
        {
            key: TYPE_PRODUCT,
            label: "Produits",
        },
        {
            key: TYPE_RECIPE,
            label: "Recettes",
        },
    ];

    /**
     * Le contexte nous donnant accés aux données :
     *   producers        Liste des producteurs
     *   productTypes     Liste des produits Type
     *   products         Liste des produits
     *   setProductTypes  MAJ de la liste des produits
     *   setProducts      MAJ de la liste des produits
     *   productsWithProducer    Liste des produits intégrant les données du producer
     * @see App.js `const dataToShare = {...`
     */
    const dataProvider = useContext(DataContext);

    /**
     * Liste des "categorie" possibles
     **/
    const categorieList = ["fruits", "légumes", "autre"];

    /**
     * Liste des "unités" possibles
     **/
    const unitList = ["Kg", "Ltr", "Piece", "100g"];

    // AJOUT MODAL
    const [fileLoad, SetFileLoad] = useState();
    const [producerToImport, setProducerToImport] = useState(null);
    const importExcel = () => {
        return (
            <Modal centered={true} show={producerToImport != null}>
                <Modal.Header closeButton onHide={() => setProducerToImport(null)}>
                    <Modal.Title id="contained-modal-title-vcenter">Faire un import de masse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="importdata" onSubmit={importProducts}>
                        <div>
                            <input
                                onChange={(e) => SetFileLoad(e.target.files[0])}
                                encType="multipart/form-data"
                                type="file"
                                name="file"
                            ></input>
                            <Modal.Footer>
                                <button title="Ajout en masse">Envoyer</button>
                            </Modal.Footer>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    };

    /**
     *  Ajout en masse
     */
    const importProducts = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // const formData = { file: fileLoad, _id: producerToImport };
        formData.append("file", fileLoad);
        formData.append("_id", producerToImport);
        // send newImport to backend

        try {
            const result = await BackEnd.formData("/import", formData);
            setMessage(result.message);
            setProducerToImport(null);
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        } catch (e) {
            console.log(e);
            setMessage("Une erreur s'est produite");
        }
    };
    /**
     * Ajout d'un item
     */
    const itemAddOne = async (newData, backEndPath, backEndReturnKey, list, setter) => {
        // send newData to backend
        const response = await BackEnd.post(backEndPath, newData);
        // check if returned value exist
        if (!response.hasOwnProperty(backEndReturnKey)) {
            if (response.status == 200) {
                alert("Erreur de communication front/back");
            }
            return null;
        }
        var creadtedData = await response[backEndReturnKey];
        // check if data is creadted
        if (!creadtedData || !creadtedData._id) {
            alert("Données ajouté dans le backend manquantes");
            return null;
        }
        // passage en edition
        setActionType("modif");
        // reccup de l'élément fraichement créé
        setItemToEdit({ ...emptyItems[typeToEdit], creadtedData });
        // maj de la list
        let newList = [creadtedData, ...list];
        setter(newList);
        // send back created data
        return creadtedData;
    };

    /**
     * modif d'un item
     */
    const itemEditOne = async (newData, backEndPath, backEndReturnKey, list, setter) => {
        // send newData to backend
        const response = await BackEnd.put(backEndPath, newData);
        // check if returned value exist
        if (!response.hasOwnProperty(backEndReturnKey)) {
            if (response.status == 200) {
                // les autres status que 200 sont déjà gérés (alert) par le wrapper
                alert("Erreur de communication front/back");
            }
            return null;
        }
        var savedData = await response[backEndReturnKey];
        // check if data is saved
        if (!savedData || !savedData._id) {
            alert("Données modifiés dans le backend manquantes");
            return null;
        }
        // maj de la list
        let dataIndex = list.findIndex((itemToTest) => itemToTest._id == savedData._id);
        list[dataIndex] = savedData;
        setter([...list]);
        // send back updated data
        return savedData;
    };

    /**
     * suppression d'un item
     */
    const itemDeleteOne = async (dataToDelete, backEndPath, backEndReturnKey, list, setter) => {
        // send data to deleted to backend
        const response = await BackEnd.delete(backEndPath, dataToDelete);
        // check if returned value exist
        if (!response.hasOwnProperty(backEndReturnKey)) {
            if (response.status == 200) {
                alert("Erreur de communication front/back");
            }
            return null;
        }
        var deletedData = await response[backEndReturnKey];
        // check if data is creadted
        if (!deletedData || !deletedData._id) {
            alert("Données modifiés dans le backend manquantes");
            return null;
        }
        // retrait de la liste
        let newList = list.filter((item) => item._id !== deletedData._id);
        setter(newList);
        // send back deleted data
        return deletedData;
    };

    /**
     * Ajout d'un produit Type
     */
    const productTypeAddOne = async (newProductType) => {
        // si le champs "catégorie" n'a pas changer, il faut la bonne valeur :/
        if (!newProductType.categorie) {
            newProductType.categorie = categorieList[0];
        }
        // appel de la function "générique d'ajout d'item
        return await itemAddOne(
            newProductType,
            "/admin/produitTypes",
            "productType",
            dataProvider.productTypes,
            dataProvider.setProductTypes
        );
    };

    /**
     * Modif d'un produit Type
     */
    const productTypeEditOne = async (newData) => {
        return await itemEditOne(
            newData,
            "/admin/produitTypes",
            "productType",
            dataProvider.productTypes,
            dataProvider.setProductTypes
        );
    };

    /**
     * Suppression d'un produit Type
     */
    const productTypeDeleteOne = async (idToDelete) => {
        return await itemDeleteOne(
            {
                _id: idToDelete,
            },
            "/admin/produitTypes",
            "productType",
            dataProvider.productTypes,
            dataProvider.setProductTypes
        );
    };

    /**
     * Ajout d'un produit
     */
    const productAddOne = async (newProduct) => {
        // si le champs "producer" n'a pas changer, il faut la bonne valeur :/
        if (newProduct.producer == "") {
            newProduct.producer = dataProvider.producers[0]._id;
        }
        if (newProduct.productType == "") {
            newProduct.productType = dataProvider.productTypes[0]._id;
        }
        if (!newProduct.unit) {
            newProduct.unit = unitList[0];
        }
        // appel de la function "générique d'ajout d'item
        return await itemAddOne(
            newProduct,
            "/admin/produits",
            "createdProduit",
            dataProvider.products,
            dataProvider.setProducts
        );
    };

    /**
     * Modif d'un produit
     */
    const productEditOne = async (newData) => {
        return await itemEditOne(
            newData,
            "/admin/produits",
            "updatedProduit",
            dataProvider.products,
            dataProvider.setProducts
        );
    };

    /**
     * Suppression d'un produit
     */
    const productDeleteOne = async (idToDelete) => {
        return await itemDeleteOne(
            {
                _id: idToDelete,
            },
            "/admin/produits",
            "deletedProduit",
            dataProvider.products,
            dataProvider.setProducts
        );
    };

    /**
     * Ajout d'un producteur
     */
    const producerAddOne = async (newProducer) => {
        return await itemAddOne(
            newProducer,
            "/admin/producteurs",
            "createdProducteur",
            dataProvider.producers,
            dataProvider.setProducers
        );
    };

    /**
     * Modif d'un producteur
     */
    const producerEditOne = async (newData) => {
        return await itemEditOne(
            newData,
            "/admin/producteurs",
            "updatedProducteur",
            dataProvider.producers,
            dataProvider.setProducers
        );
    };

    /**
     * Suppression d'un producteur
     */
    const producerDeleteOne = async (idToDelete) => {
        return await itemDeleteOne(
            {
                _id: idToDelete,
            },
            "/admin/producteurs",
            "deletedProducteur",
            dataProvider.products,
            dataProvider.setProducts
        );
    };

    /**
     * Ajout d'une recette
     */
    const recipeAddOne = async (newRecipe, list) => {
        newRecipe.ingredients = list;

        console.log(list);
        console.log(newRecipe);
        return await itemAddOne(newRecipe, "/admin/recettes", "createdRecette", dataProvider.recipes, dataProvider.setRecipes);
    };

    /**
     * Modif d'une recette
     */
    const recipeEditOne = async (newRecipe, list) => {
        newRecipe.ingredients = list;

        return await itemEditOne(newRecipe, "/admin/recettes", "updatedRecette", dataProvider.recipes, dataProvider.setRecipes);
    };

    /**
     * Suppression d'une recette
     */
    const recipeDeleteOne = async (idToDelete) => {
        return await itemDeleteOne(
            {
                _id: idToDelete,
            },
            "/admin/recettes",
            "deletedRecette",
            dataProvider.recipes,
            dataProvider.setRecipes
        );
    };

    /**
     * Suppression d'un élément (produit, producteur ou recette)
     */
    const removeItem = async (id) => {
        let deletedItem;
        switch (typeToEdit) {
            case TYPE_PRODUCT_TYPE:
                deletedItem = await productTypeDeleteOne(id);
                break;
            case TYPE_PRODUCT:
                deletedItem = await productDeleteOne(id);
                break;
            case TYPE_PRODUCER:
                deletedItem = await producerDeleteOne(id);
                break;
            case TYPE_RECIPE:
                deletedItem = await recipeDeleteOne(id);
            default:
                // nothing to do, return
                console.log(typeToEdit + " with id = " + id + " to delete");
                break;
        }

        if (itemToEdit._id && itemToEdit._id == deletedItem._id) {
            // si l'on affichait ce que l'on viens de delete,
            // retour à l'ajout
            setActionType("add");
            // raz du form
            setItemToEdit({ ...emptyItems[typeToEdit] });
        }
    };

    /**
     * Type d'édition : "add" ou "modif"
     */
    const [actionType, setActionType] = useState("add");

    /**
     * ProduitType vide (avec les valeurs par default)
     * to avoid : "A component is changing an uncontrolled input to be controlled.
     * This is likely caused by the value changing from undefined to a defined value, which should not happen."
     */
    const emptyNewProductType = {
        name: "",
        // Nom du produit
        name: "",
        // Image en mode base64encode
        image: "",
        // Description
        description: "",
        // Description courte
        resume: "",
        // Catégorie (fruits, légumes, autre)
        categorie: "fruits",
        // Visibilité sur le site YES / NO
        enable: true,
        // Mis en avant ON / OFF
        promote: false,
    };

    /**
     * Produit vide (avec les valeurs par default)
     */
    const emptyNewProduct = {
        // Nom du produit
        name: "",
        // Code produit
        sku: "",
        // Image en mode base64encode
        image: "",
        // Description
        description: "",
        // Description courte
        resume: "",
        // id pointant vers un produit Type
        productType: "",
        // Visibilité sur le site YES / NO
        enable: true,
        // Mis en avant ON / OFF
        promote: false,
        // id pointant vers un producer
        producer: "",
        // Prix moyen TTC
        price: 0,
    };

    /**
     * Producteur vide (avec les valeurs par default)
     */
    const emptyNewProducer = {
        // Nom du producteur
        name: "",
        // Image en mode base64encode
        image: "",
        // Description
        description: "",
        // Description courte
        resume: "",
        // Addresse (CP, ville)
        address: "",
    };

    /*
     * Recette vide (avec les valeurs par défault)
     */
    const emptyNewRecipe = {
        // Nom de la recette
        name: "",
        // Image
        image: "",
        // Nombre de parts
        shares: "",
        // Temps de préparation
        time: "",
        // Description de la recette
        description: "",
        // Ingrédients
        ingredients: "",
    };

    /**
     * Les items vides en fonction du type d'item
     */
    const emptyItems = {
        [TYPE_PRODUCT_TYPE]: emptyNewProductType,
        [TYPE_PRODUCT]: emptyNewProduct,
        [TYPE_PRODUCER]: emptyNewProducer,
        [TYPE_RECIPE]: emptyNewRecipe,
    };

    /**
     * l'élément en cours d'édition
     */
    const [itemToEdit, setItemToEdit] = useState(emptyNewProductType);

    /**
     * choix d'un élément à editer
     */
    const openEditItem = (id) => {
        setActionType("modif");

        // reccup de l'élément dans la liste en fonction de son id
        const itemToEdit = {
            ...emptyItems[typeToEdit],
            ...dataList.find((item) => item._id == id),
        };
        setItemToEdit(itemToEdit);
    };

    /**
     * Retour à l'Ajout d'un élément
     */
    const addMode = () => {
        setActionType("add");
        setItemToEdit({ ...emptyItems[typeToEdit] });
    };

    /**
     * filtres par default : pas de filtrage
     **/
    const defaultFilters = {
        producer: "",
        productType: "",
    };

    /**
     * Les filtres actuellement choisis
     **/
    const [currentFilters, setFilters] = useState(defaultFilters);

    /**
     * Le filtrage doit il etre refait ?
     **/
    const [currentFiltersNeedRefresh, setFiltersIsUpdated] = useState(false);

    /**
     * Recherche des produits depuis un produitType ou producer
     * @param {*} productTypeId
     */
    const filterProductByItem = (field, id) => {
        setFilters({
            [field]: id,
        });
        setTypeToEdit(TYPE_PRODUCT_FILTERED);
    };

    /**
     * Lors d'un changement d'item, il faut rafraichir la liste affiché
     */
    useEffect(() => {
        // demande de chargement de la liste de produits (ou produitsType) afffichés
        filterUpdated(currentFilters, true);
        setFiltersIsUpdated(false);
    }, [
        currentFiltersNeedRefresh,
        dataProvider.productsWithProducer,
        dataProvider.producers,
        dataProvider.productTypes,
    ]);

    /**
     * La liste d'item à afficher (par default la liste de produits)
     */
    const [dataList, setDataList] = useState(dataProvider.productsWithProducer);

    /**
     * MAJ du type d'item en cours de listing
     * parmis "productType",  "product", "producer" (soon "recipe")
     */
    const [typeToEdit, setTypeToEdit] = useReducer((oldValue, newType) => {
        switch (newType) {
            case TYPE_PRODUCT_TYPE:
                setDataList(dataProvider.productTypes);
                break;
            case TYPE_PRODUCT:
            case TYPE_PRODUCT_FILTERED:
                setDataList(dataProvider.productsWithProducer);
                break;
            case TYPE_PRODUCER:
                setDataList(dataProvider.producers);
                break;
            case TYPE_RECIPE:
                setDataList(dataProvider.recipes);
                break;
            default:
                break;
        }
        setActionType("add");
        if (newType == TYPE_PRODUCT_FILTERED) {
            // listing de produit
            newType = TYPE_PRODUCT;
            // pas de RAZ filtres,
            setFiltersIsUpdated(true);
        } else {
            setFilters(defaultFilters);
        }
        setItemToEdit({ ...emptyItems[newType] });
        return newType;
    }, TYPE_PRODUCT_TYPE);

    /**
     * Changement d'un filtre
     **/
    const filterUpdated = (newFilters, onlyRefreshList = false) => {
        let listToFilter = null;
        switch (typeToEdit) {
            case TYPE_PRODUCT_TYPE:
                listToFilter = dataProvider.productTypes;
                break;
            case TYPE_PRODUCT:
                listToFilter = dataProvider.productsWithProducer;
                break;
            case TYPE_PRODUCER:
                listToFilter = dataProvider.producers;
                break;
            case TYPE_RECIPE:
                listToFilter = dataProvider.recipes;
                break;
            default:
                // nothing to do, return
                return;
        }
        const filterdList = listToFilter.filter((item) => {
            let itemToKeep = true;
            Object.entries(newFilters).forEach(([key, value]) => {
                if (!value) {
                    // filtre vide : pas de filtrage
                    return;
                }
                if (!Object.hasOwn(item, key)) {
                    // filtre non applicable ... ce type d'item ne contient pas cette clef
                    return;
                }
                if (item[key] != value && (!item[key] || !item[key]._id || item[key]._id != value)) {
                    // le champs est differant du filtre
                    itemToKeep = false;
                    // inutil de verifier les autres filtres
                    return false;
                }
            });
            return itemToKeep;
        });
        setDataList([...filterdList]);
        if (onlyRefreshList) {
            return;
        }
        setFilters(newFilters);
        setActionType("add");
        setItemToEdit({ ...emptyItems[typeToEdit] });
    };
    /**
     * Changement de type d'item à editer/lister
     */
    function changeContentType(event) {
        setTypeToEdit(event.target.value);
    }

    /**
     * Affichage d'un formulaire en fonction du type d'item
     */
    const renderForm = () => {
        switch (typeToEdit) {
            case TYPE_PRODUCT_TYPE:
                return (
                    <FormProductType
                        key={itemToEdit._id}
                        itemType={typeToEdit}
                        actionType={actionType}
                        productType={itemToEdit}
                        addOne={productTypeAddOne}
                        editOne={productTypeEditOne}
                        categorieList={categorieList}
                    />
                );
                break;
            case TYPE_PRODUCT:
                return (
                    <FormProduct
                        key={itemToEdit._id}
                        itemType={typeToEdit}
                        actionType={actionType}
                        product={itemToEdit}
                        addOne={productAddOne}
                        editOne={productEditOne}
                        unitList={unitList}
                    />
                );
                break;
            case TYPE_PRODUCER:
                return (
                    <FormProducer
                        key={itemToEdit._id}
                        itemType={typeToEdit}
                        actionType={actionType}
                        producer={itemToEdit}
                        addOne={producerAddOne}
                        editOne={producerEditOne}
                    />
                );
                break;
            case "recipes":
                return (
                    <FormRecipe
                        key={itemToEdit._id}
                        itemType={typeToEdit}
                        actionType={actionType}
                        recipe={itemToEdit}
                        addOne={recipeAddOne}
                        editOne={recipeEditOne}
                    />
                );
                break;
            default:
                break;
        }
    };

    /**
     * Affichage des filtrage en fonction du type d'item
     */
    const renderFilters = () => {
        switch (typeToEdit) {
            case TYPE_PRODUCT_TYPE:
                return (
                    <FilterProductTypes
                        categorieList={categorieList}
                        filters={currentFilters}
                        cbFilterUpdated={filterUpdated}
                    />
                );
                break;
            case TYPE_PRODUCT:
                return (
                    <FilterProducts
                        categorieList={categorieList}
                        filters={currentFilters}
                        cbFilterUpdated={filterUpdated}
                    />
                );
                break;
            case TYPE_PRODUCER:
                break;
            default:
                break;
        }
    };

    return (
        <section className="MainContainer">
            <Toast style={{ position: "absolute" }} show={message != null} onClose={() => setMessage(null)}>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                    <small>Maintenant</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>

            <div className="col">
                <div className="itemTypeActions">
                    {importExcel()}
                    <select name="itemType" onChange={changeContentType} value={typeToEdit}>
                        {TYPES_LABELS.map((itemType) => {
                            return (
                                <option key={itemType.key} value={itemType.key}>
                                    {itemType.label}
                                </option>
                            );
                        })}
                    </select>
                    <div className="btn action add" onClick={addMode}>
                        <i className="fas fa-plus"></i>
                    </div>
                </div>

                {renderFilters()}
                <ListItems
                    idSelected={itemToEdit._id ?? null}
                    list={dataList}
                    itemType={typeToEdit}
                    openEdit={openEditItem}
                    removeItem={removeItem}
                    filterProductByItem={filterProductByItem}
                    massUpdate={setProducerToImport}
                />
            </div>
            <div className="col">{renderForm()}</div>
        </section>
    );
}

export default MainContainer;
