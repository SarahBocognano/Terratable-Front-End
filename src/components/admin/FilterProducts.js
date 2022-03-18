import { useContext } from "react";
import DataContext from "../../utils/DataProvider";

function FilterProducts(props) {
    /**
     * Le contexte nous donnant accés aux données
     * use :
     * // La liste des producteurs possibles pour filtrer les produits
     *  * poducers
     *
     */
    const dataProvider = useContext(DataContext);
    
    /**
     * Liste des "categorie" possibles
     **/
    const categorieList = props.categorieList;

    /**
     * callback d'un changement de filtre
     **/
    const filterUpdated = props.cbFilterUpdated;

    /**
     * Les filtres actuellement choisis
     **/
    const filters = props.filters;

    /**
     * Changement d'un filtre
     */
    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        filterUpdated(newFilters);
    };
    return (
        <div className="rowFilter">
            <select
                name="productType"
                onChange={handleChange}
                value={filters.productType}
            >
                <option key="-1" value="">
                    Tous les types
                </option>
                {dataProvider.productTypes.map((productTypePossible, index) => (
                    <option key={productTypePossible._id} value={productTypePossible._id}>
                        {productTypePossible.name}
                    </option>
                ))}
            </select>

            {dataProvider.producers.length > 0 && <select
                name="producer"
                onChange={handleChange}
                value={filters.producer}
            >
                <option key="-1" value="">
                    Tous les producteurs
                </option>
                {dataProvider.producers.map((producerPossible, index) => (
                    <option key={index} value={producerPossible._id}>
                        {producerPossible.name}
                    </option>
                ))}
            </select>}
        </div>
    );
}
export default FilterProducts;
