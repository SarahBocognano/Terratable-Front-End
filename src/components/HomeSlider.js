import "../styles/homeSlider.scss";

function HomeSlider(props) {
    return (
        <main className="containerSlider-Home">
            <div className="sliderHome">
                <div>
                    <img className="image" src={require("../assets/image_accueil.jpg")} />
                    <span className="slogan">Le chef c'est vous</span>
                </div>
            </div>
        </main>
    );
}

export default HomeSlider;
