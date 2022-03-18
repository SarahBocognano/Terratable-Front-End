function ListItemRecipe(props) {
      /**
     * L'item est il en cours d'édition
     */
       const isSelected = props.selected;

       /**
     * la recette à afficher dans la liste
     * */

       const recipe = props.recipe;
       console.log("Ma recette", recipe);

    return(
        <li className={isSelected ? "ListItem selected" : "ListItem"}>
        <div className="infosLeft">
            <span className="title">
                {isSelected && <i className="fas fa-angle-right"></i>}
                {recipe.name}
            </span>
            <span className="producteursName">{recipe.description}</span>
        </div>
        <div className="rightAction">
            <span
                className="iconBtn action update"
                onClick={() => props.openEdit(recipe._id)}
            >
                <i className="fas fa-pencil-alt"></i>
            </span>
            <span
                className="iconBtn action delete"
                onClick={() => props.removeItem(recipe._id)}
            >
                <i className="fas fa-trash-alt"></i>
            </span>
        </div>
    </li>
    )
}

export default ListItemRecipe;