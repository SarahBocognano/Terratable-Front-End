import "../styles/farmerPage.scss";
import DataContext from "../utils/DataProvider";
import slugify from "../utils/slugify";
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

function FarmerPage() {
    /**
     * Le contexte nous donnant accés aux données
     * @see App.js `const dataToShare = {...`
     */
    const dataProvider = useContext(DataContext);

    /**
     * Le parametre dans l'url
     */
    const { slugNid } = useParams();

    /**
     * Recherche de l'id (apres le slug)
     */
    let producerId = slugNid;
    if (slugNid.indexOf("-") != -1 && slugNid.indexOf("-") != slugNid.length) {
        const parts = slugNid.split('-');
        // on garde la derniere partie (après le slug)
        producerId = parts[parts.length - 1];
    }

    /**
     * les données du producer
     */
    const producer = dataProvider.producers.find(
        (producer) => producer._id == producerId
    );

    if (!producer) {
        // product type not found
        return <NotFoundPage />;
    }

    const productList = dataProvider.productsWithProducer.filter((product) => {
        return product.producer && product.producer._id == producer._id
    });

    return (
        <div className="FarmerPage">
            <div className="FarmerBloc">
                <div className="farmerImage">
                    <img
                        className="defaultImg"
                        src={require("../assets/logoNoir.png")}
                    />
                </div>
                <div className="farmerText">
                    <h2>{producer.name}</h2>
                    <p>
                        loreMauris sodales odio eu molestie consequat. Ut
                        bibendum convallis aliquet. Etiam pellentesque ornare
                        porta. Nunc semper, nibh vel dapibus lacinia, nibh nisi
                        consectetur enim, ac ullamcorper tellus dui sagittis
                        libero. Morbi hendrerit nisl nunc, id tempor dolor
                        varius vel. Phasellus quis interdum lacus, ac dapibus
                        dolor. Fusce tincidunt laoreet erat id malesuada.
                        Phasellus tempus interdum turpis, ac semper dolor
                        commodo quis. Quisque at semper libero. Suspendisse
                        posuere nulla a massa malesuada, sit amet dictum odio
                        mattis. Proin bibendum euismod neque et posuere.
                    </p>
                    <span className="localization">
                        <i className="fas fa-map-marker-alt"></i>
                        <span className="farmerCity">{producer.address}</span>
                    </span>
                </div>
            </div>
            {productList.length && (
                <div className="productListWrapper">
                    <h2>Catalogue</h2>
                    <div className="productList">

                        {productList.map((product, index) => (
                            <div className="item">
                                <img src={require("../assets/logoNoir.png")} />
                                <div className="vignette">
                                    <span>
                                        {product.name} <br />
                                        <span className="price">{product.price}€/{product.unit}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FarmerPage;
