import '../styles/recipeDetail.scss';
import { AiOutlinePieChart } from "react-icons/ai";
import { MdOutlineWatchLater } from "react-icons/md";

function RecipeDetail () {
    return(
        <div className="ProductDetail">
            <div className="FarmerBloc">
                <div className="farmerImage">
                    <img className="recipeImg" src={require('../assets/salad.jpg')} />
                </div>
                <div className="farmerText">
                    <h2>Salade d'épinards</h2>
                    <div className="underTitle">
                        <AiOutlinePieChart />
                        <p>2</p>
                        <p>|</p>
                        <MdOutlineWatchLater />
                        <p>20 min</p>
                    </div>
                    <h3>Ingrédients</h3>
                    <ul>
                        <li>500g de feuilles d'épinards</li>
                        <li>1 grenade</li>
                        <li>150g de poulet</li>
                        <li>60g d'oignon rouge</li>
                        <li>3 c. à soupe de vinaigre de vin rouge</li>
                        <li>3 c. à soupe d'huile d'olive</li>
                        <li>4 c. à café de miel</li>
                        <li>1 c. à café de moutarde de Dijon</li> 
                    </ul>
                </div>
            </div>
            <div className="recipeSteps">
                    <h2>Les étapes</h2>
                    <ul>
                        <li>Faites cuire le blanc de poulet une dizaine de minutes dans une poêle avec un peu de matières grasses.</li>
                        <li>Pendant ce temps, lavez et égouttez les feuilles d'épinards. </li>
                        <li>Coupez la grenade et récupérez les grains</li>
                        <li>Dans un petit bol, à l'aide d'un fouet, mélanger le vinaigre, l'huile, le miel et la moutarde. Salez et poivrez.</li>
                        <li>Mélangez les feuilles d'épinards, les grains de grenade et le poulet dans un récipient et arrosez les portions de salade de la vinaigrette.</li>
                    </ul>       
            </div>
        </div>
    )
}

export default RecipeDetail;