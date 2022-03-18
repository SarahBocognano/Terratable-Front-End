import { useEffect, useState, useContext } from "react";

import HomeSlider from "../components/HomeSlider";
import FarmerBloc from "../components/FarmerBloc";
import ProduitDisplay from "../components/ProduitDisplay";

import DataContext from "../utils/DataProvider";

import "../styles/home.scss";

/**
 * La liste des produits (tous) provient de "props.productList"
 * La liste des producteurs provient de     "props.producerList"
 */
function Home(props) {
    /**
     * Liste des produits "Mis en avant" à afficher
     * => contenant le champs "enable" à "true" (!= false)
     * && contenant le champs "promote" à "true"
     */
    const [promoteProducts, setPromoteProducts] = useState([]);

    const dataProvider = useContext(DataContext);

    /**
     * Effet lors de la première exécution du composant
     * et surveillance du chargement des listes d'items
     * => Reccup des produits mis en avant
     */
    useEffect(() => {
        // verif que toutes les listes soient chargées
        if (dataProvider.productTypesFull.length) {
            // filtrage de la liste complete des products
            // pour ne concerver que les "visible" ET "mis en avant"
            let filteredList = dataProvider.productTypesFull.filter(
                (product) =>
                    product.enable != "false" && product.promote != "false"
            );
            setPromoteProducts(filteredList);
        }
    }, [dataProvider.productTypesFull]);

    /**
     * Main render
     */
    return (
        <div>
            <HomeSlider />
            <div className="meaProductBloc">
                <h2>Notre sélection de produit</h2>
                <div className="meaProductList">
                    {promoteProducts.map((produitData, index) => (
                        <ProduitDisplay
                            key={index}
                            content={produitData}
                        ></ProduitDisplay>
                    ))}
                </div>
            </div>
            <h2>Ce mois-ci à l'honneur</h2>
            {dataProvider.producers.map((producer) => (
                <FarmerBloc key={producer._id} producer={producer} />
            ))}
        </div>
    );
}

export default Home;
