import { useContext } from "react";
import DataContext from "../../utils/DataProvider";

function FilterProductTypes(props) {
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
                name="categorie"
                onChange={handleChange}
                value={filters.categorie}
            >
                <option key="-1" value="">
                    Toutes les catégories
                </option>
                {categorieList.map((categoriePossible, index) => (
                    <option key={index} value={categoriePossible}>
                        {categoriePossible}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default FilterProductTypes;
