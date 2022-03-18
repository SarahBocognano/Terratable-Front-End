import React from "react";
import { useState, useEffect } from "react";
import "../../styles/admin/Form.css";

function ToggleField(props) {
    /**
     * La valeur actuelle
     */
    const [currenValue, setValue] = useState(props.value);

    /**
     * Les valeurs possibles
     */
    const possibleValues = props.items;

    /**
     * L'element à affiché
     */
    const [currenItemToDisplay, setItemToDisplay] = useState({
        value: "none",
        iconClassName: null,
        label: "loading",
    });

    /**
     * L'index de l'element affiché
     */
    const [currenIndexToDisplay, setIndexToDisplay] = useState(0);

    /**
     * Le callback à lancer lors apres une modif
     */
    const onChangeCallback = props.onChange;

    /**
     * Le nom du champs en cours d'édition
     */
    const fieldName = props.fieldName;

    /**
     * Changement du champ
     */
    const toggleOption = (e) => {
        let newIndex = currenIndexToDisplay + 1;
        if (newIndex >= possibleValues.length) {
            newIndex = 0;
        }
        let newValue = possibleValues[newIndex].value;
        setIndexToDisplay(newIndex);
        setItemToDisplay(possibleValues[newIndex]);
        setValue(newValue);
        // forward to container
        onChangeCallback(fieldName, newValue);
    };

    /**
     * Effet lors de la première exécution du composant
     * => Recherche de l'élément selectionné
     */
    useEffect(() => {
        let indexToDisplay = possibleValues.findIndex(
            (itemToTest) => itemToTest.value == currenValue
        );
        if (indexToDisplay == -1) {
            indexToDisplay = 0;
        }
        setIndexToDisplay(indexToDisplay);
        setItemToDisplay(possibleValues[indexToDisplay]);
    }, []);

    /**
     * Main Render
     */
    return (
        <div
            title={props.title}
            className="toggle input"
            data-value={currenValue}
            onClick={toggleOption}
        >
            <div
                className={
                    "toggle option" +
                    (!currenItemToDisplay.value ? " option-disable" : "")
                }
                data-value={currenItemToDisplay.value}
            >
                {currenItemToDisplay.iconClassName && (
                    <i className={currenItemToDisplay.iconClassName}></i>
                )}
                {currenItemToDisplay.label}
            </div>
        </div>
    );
}

export default ToggleField;
