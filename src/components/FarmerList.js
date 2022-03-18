import '../styles/farmerList.scss'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import DataContext from "../utils/DataProvider";
import slugify from "../utils/slugify";

function FarmerList() {
    const dataProvider = useContext(DataContext);
    return (
        <div className="FarmerList">
            <h2>Tous les producteurs</h2>
            <div className="FarmerWrapper">
                {dataProvider.producers.map((producer) => (
                    <>
                        <Link to={"/producteurs/" + slugify(producer.name) + "-" + producer._id}>
                            <div className="farmer">
                                <div className="img">
                                    <img src={require('../assets/logoNoir.png')} />
                                </div>
                                <span className="farmerInfos">
                                    <span>
                                        {producer.name}
                                    </span>
                                    <span>
                                        {producer.address}
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </>
                ))}
            </div>
        </div>

    );
}

export default FarmerList;
