import "./styles/reset.css";
import "./styles/fontAwesome.css";
import "./App.scss";
//import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import BackEnd from "./utils/ApiWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Basket from "./components/Basket";
import Producers from "./pages/Producers";
import Recipes from "./pages/Recipes";
import ProductDetail from "./pages/ProductDetail";
import RecipeDetail from "./pages/RecipeDetail";
import FarmerDetail from "./pages/FarmerDetail";
import Products from "./pages/Products";
import Commande from "./pages/Commande";
import NotFoundPage from "./pages/NotFoundPage";
import StripeContainer from "./stripe/StripeContainer";

import AdminConnection from "./components/admin/AdminConnection";
import PageCommande from "./components/PageCommande";

import AdminWrapper from "./components/admin/MainContainer";
import ScrollToTop from "./wrapper/ScrollToTop";

import DataContext from "./utils/DataProvider";
import CartProvider from "./utils/CartProvider";

function App() {
  /* recipe: {
        name: String,               
        description: String,        // Déroulé de la recette
        shares: Number,             // Nombre de parts
        time: Number,               // Temps de préparation 
        images: [                   // Image
            data: Buffer, 
            contentType:String
            ],
        ingredients: [
            name: String, 
            quantity: Number, 
            unit: String, 
            available: Boolean
            ],
    } */

  const [recipes, setRecipes] = useState(null);
  console.log("La liste des recettes", recipes);

  /**
   * Liste des producteurs
   * producer: {
   *      name: String,
   *      image: String,          // Image en mode base64encode
   *      description: String,    // Description
   *      resume: String,         // Description courte
   *      address: String,        // Code postal, ville
   *      created: {              // champs auto généré indiquant la date de création de l'objet
   *          type: Number,
   *          default: Date.now,
   *      },
   *  }
   *
   */
  const [producers, setProducers] = useState(null);

  /**
   * Liste des produit types
   * productType: {
   *      name: String,
   *      categorie: String,      // Catégorie (fruit, légume, autre)
   *      image: String,          // Image en mode base64encode
   *      description: String,    // Description
   *      resume: String,         // Description courte
   *      enable: String,         // Visibilité sur le site YES / NO
   *      promote: String,        // Mis en avant ON / OFF
   *      created: {              // champs auto généré indiquant la date de création de l'objet
   *          type: Number,
   *          default: Date.now,
   *      },
   *  }
   *
   */
  const [productTypes, setProductTypes] = useState(null);

  const [productTypesFull, setProductTypesFull] = useState(null);
  /**
   * construction de la liste des produits (avec producer et produitType)
   * à partir des trois listes `products`, `productTypes` et `producer`
   */
  const buildFullProductTypes = (productTypeList, productsWithProducer) => {
    // parcours de la liste de product
    const newList = productTypeList.map((productType) => {
      const compiletProductType = { ...productType };

      // les produits associés
      compiletProductType.products = productsWithProducer.filter(
        (product) =>
          product.productType &&
          product.productType._id == productType._id &&
          product.enable != "false" &&
          product.price
      );
      // le prix moyen
      compiletProductType.priceAvg = 0;
      compiletProductType.products.map((product) => {
        compiletProductType.priceAvg += parseFloat(product.price ?? 0);
      });
      compiletProductType.priceAvg =
        Math.floor(
          (100 * compiletProductType.priceAvg) /
            compiletProductType.products.length
        ) / 100;

      // les producteurs associés (aux produits associés)
      const producerIds = compiletProductType.products.map(
        (product) => product.producer._id
      );
      compiletProductType.producers = producers.filter(
        (producer) => producerIds.indexOf(producer._id) != -1
      );
      return compiletProductType;
    });
    const filterdList = newList.filter(
      (productType) =>
        productType.producers.length && productType.products.length
    );
    // sauvegarde de cette liste
    setProductTypesFull(filterdList);
  };
  /**
   * Liste des produits
   * dont le champs `producer`(_id) est remplacé par les données completes
   * dont le champs `produitType`(_id) est remplacé par les données completes
   */
  const [productsWithProducer, setProductsWithProducer] = useState(null);

    /**
     * construction de la liste des produits (avec producer et produitType)
     * à partir des trois listes `products`, `productTypes` et `producer`
     */
    const buildFullProducts = (productList) => {
        if (!productTypes || !producers) {
            return;
        }
        // parcours de la liste de product
        const newList = productList.map((product) => {
            return {
                ...product,
                // ajout de son producteur associé
                producer: producers.find((producer) => producer._id == product.producer),
                // ajout de son produitType associé
                productType: productTypes.find((productType) => productType._id == product.productType),
            };
        });
        // sauvegarde de cette liste
        setProductsWithProducer(newList);

        buildFullProductTypes(productTypes, newList);
    };

    /**
     * Liste des produits
     * product: {
     *      name: String,
     *      sku: String,            // Code produit (unique)
     *      image: String,          // Image en mode base64encode
     *      description: String,    // Description
     *      resume: String,         // Description courte
     *      productType: String,    // id pointant vers un ProduitType
     *      enable: String,         // Visibilité sur le site YES / NO
     *      promote: String,        // Mis en avant ON / OFF
     *      producer: String,       // id pointant vers un Producer
     *      price: Number,          // Prix de vente TTC
     *      unit: String,           // Unité de vente (Kg, Ltr, Piece)
     *      created: {              // champs auto généré indiquant la date de création de l'objet
     *          type: Number,
     *          default: Date.now,
     *      },
     *  }
     */
    const [products, setProducts] = useReducer((oldList, newList) => {
        newList && buildFullProducts(newList);
        return newList;
    }, null);

    const [nbListLoaded, setNbListLoaded] = useState(0);
    /**
     * Récupération des données depuis le back-end
     */
    const loadListFromBackEnd = async (path, callback) => {
        // Requête vers le backend en GET
        // Assignation des données à la variable d'état via la fonction fournis en callback
        const datasLoaded = await BackEnd.get(path, callback);
        setNbListLoaded(nbListLoaded + 1);
    };

    /**
     * reste-t-il des listes d'items à charger ?
     */
    const [isLoading, setLoading] = useState(true);

    /**
     * Effet permettant de surveiller le chargement des données
     */
    useEffect(() => {
        if (
            // il reste des listes à charger
            !products ||
            !producers ||
            !recipes ||
            !productTypes
        ) {
            return;
        }
        buildFullProducts(products);
        setLoading(false);
    }, [nbListLoaded, recipes, products, producers, productTypes]);

    /**
     * Effet lors de la première exécution du composant
     * => demande de chargement des listes de données
     */
    useEffect(() => {
        // demande de chargement des listes d'items
        loadListFromBackEnd("/producteurs", setProducers);
        loadListFromBackEnd("/produitTypes", setProductTypes);
        loadListFromBackEnd("/produits/list", setProducts);
        loadListFromBackEnd("/recettes", setRecipes);
    }, []);

    // Connection utilisateur
    const localDataKey = "@user";
    const [isLoggedIn, setIsloggedIn] = useState(JSON.parse(localStorage.getItem(localDataKey)));

    const renderAdminRoute = () => {
        if (isLoggedIn && isLoggedIn.isAdmin) {
            return (
                <>
                    <Route path="/admin" element={<AdminWrapper />} />
                    <Route path="/admin/user" element={<AdminConnection />} />
                </>
            )
        }
        return <Route path="/admin/user" element={<AdminConnection />} />;
    };

    /**
     * création des jeux de datas et des fonction permetant de les mettres à jour
     */
    const dataToShare = {
        // Liste des produits
        products,
        // Liste des produits intégrant les données du producer
        productsWithProducer,
        // MAJ de la liste des produits
        setProducts,
        // Liste des catégorie de produits
        productTypes,
        // Les produits type avec le nb producteur, et le price avg
        productTypesFull,
        // MAJ de la liste des catégorie de produits
        setProductTypes,
        // Liste des producteurs
        producers,
        // MAJ de la liste des producteurs
        setProducers,
        // User connecté
        isLoggedIn,
        // MAJ user connecté
        setIsloggedIn,
        // local storage name
        localDataKey,
        // Liste des Recettes
        recipes,
        // MAJ de la liste des recettes
        setRecipes,
        // le panier et sa gestion
        // + Rechargement du contenue du panier depuis le localstorage
        cart: CartProvider,
    };

    /**
     * wait to render children while data isn't loaded
     */
    if (isLoading) {
        return (
            <section className="App loading">
                <div className="fa-3x">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            </section>
        );
    }
    // parcours de la liste de product
    const newList = productList.map((product) => {
      return {
        ...product,
        // ajout de son producteur associé
        producer: producers.find(
          (producer) => producer._id == product.producer
        ),
        // ajout de son produitType associé
        productType: productTypes.find(
          (productType) => productType._id == product.productType
        ),
      };
    });
    // sauvegarde de cette liste
    setProductsWithProducer(newList);

    buildFullProductTypes(productTypes, newList);
  };

  /**
   * Liste des produits
   * product: {
   *      name: String,
   *      sku: String,            // Code produit (unique)
   *      image: String,          // Image en mode base64encode
   *      description: String,    // Description
   *      resume: String,         // Description courte
   *      productType: String,    // id pointant vers un ProduitType
   *      enable: String,         // Visibilité sur le site YES / NO
   *      promote: String,        // Mis en avant ON / OFF
   *      producer: String,       // id pointant vers un Producer
   *      price: Number,          // Prix de vente TTC
   *      unit: String,           // Unité de vente (Kg, Ltr, Piece)
   *      created: {              // champs auto généré indiquant la date de création de l'objet
   *          type: Number,
   *          default: Date.now,
   *      },
   *  }
   */
  const [products, setProducts] = useReducer((oldList, newList) => {
    newList && buildFullProducts(newList);
    return newList;
  }, null);

  const [nbListLoaded, setNbListLoaded] = useState(0);
  /**
   * Récupération des données depuis le back-end
   */
  const loadListFromBackEnd = async (path, callback) => {
    // Requête vers le backend en GET
    // Assignation des données à la variable d'état via la fonction fournis en callback
    const datasLoaded = await BackEnd.get(path, callback);
    setNbListLoaded(nbListLoaded + 1);
  };

  /**
   * reste-t-il des listes d'items à charger ?
   */
  const [isLoading, setLoading] = useState(true);

  /**
   * Effet permettant de surveiller le chargement des données
   */
  useEffect(() => {
    if (
      // il reste des listes à charger
      !products ||
      !producers ||
      !recipes ||
      !productTypes
    ) {
      return;
    }
    buildFullProducts(products);
    setLoading(false);
  }, [nbListLoaded, recipes, products, producers, productTypes]);

  /**
   * Effet lors de la première exécution du composant
   * => demande de chargement des listes de données
   */
  useEffect(() => {
    // demande de chargement des listes d'items
    loadListFromBackEnd("/producteurs", setProducers);
    loadListFromBackEnd("/produitTypes", setProductTypes);
    loadListFromBackEnd("/produits/list", setProducts);
    loadListFromBackEnd("/recettes", setRecipes);
  }, []);

  // Connection utilisateur
  const localDataKey = "@user";
  const [isLoggedIn, setIsloggedIn] = useState(
    JSON.parse(localStorage.getItem(localDataKey))
  );

  const renderAdminRoute = () => {
    if (isLoggedIn && isLoggedIn.isAdmin) {
      return (
        <>
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="/admin/user" element={<AdminConnection />} />
        </>
      );
    }
    return <Route path="/admin/user" element={<AdminConnection />} />;
  };

  /**
   * création des jeux de datas et des fonction permetant de les mettres à jour
   */
  const dataToShare = {
    // Liste des produits
    products,
    // Liste des produits intégrant les données du producer
    productsWithProducer,
    // MAJ de la liste des produits
    setProducts,
    // Liste des catégorie de produits
    productTypes,
    // Les produits type avec le nb producteur, et le price avg
    productTypesFull,
    // MAJ de la liste des catégorie de produits
    setProductTypes,
    // Liste des producteurs
    producers,
    // MAJ de la liste des producteurs
    setProducers,
    // User connecté
    isLoggedIn,
    // MAJ user connecté
    setIsloggedIn,
    // local storage name
    localDataKey,
    // Liste des Recettes
    recipes,
    // MAJ de la liste des recettes
    setRecipes,
  };

  /**
   * wait to render children while data isn't loaded
   */
  if (isLoading) {
    return (
      <section className="App loading">
        <div className="fa-3x">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </section>
    );
  }
  /**
   * Main render
   */

  return (
    <div className="App">
      <DataContext.Provider value={dataToShare}>
        <BrowserRouter>
          <ScrollToTop>
            <Header />
            <Routes>
              <Route path="/producteurs" element={<Producers />} />
              <Route path="/panier" element={<Basket />} />
              <Route path="/produits" element={<Products />} />
              <Route path="/produits/:slugNid" element={<ProductDetail />} />
              <Route path="/recettes" element={<Recipes />} />
              <Route path="/recettes/id" element={<RecipeDetail />} />
              <Route path="/producteurs" element={<Producers />} />
              <Route path="/producteurs/id" element={<FarmerDetail />} />
              <Route path="/panier/commande" element={<Commande />} />
              <Route path="/paiement" element={<StripeContainer />} />
              {renderAdminRoute()}
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/" element={<Home />} />
            </Routes>
            <Footer />
          </ScrollToTop>
        </BrowserRouter>
      </DataContext.Provider>
    </div>
  );
  }
export default App;
