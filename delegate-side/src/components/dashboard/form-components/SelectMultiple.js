import React, { useContext, useEffect, useState } from "react";
import "./PreviewComponents.scoped.css";
import { GoSearch } from "react-icons/go";
import { appContext } from "../../../Context";

function SelectMultiple(props) {
    const {delegations} = useContext(appContext);
    const [options, setOptions] = useState((props.options == "all-delegations"? delegations.map(item => item.name):props.options));
    const [search, setSearch] = useState('');
    const [renderOptions, setRenderOptions] = useState([]);
    const [isShowingOptions, setIsShowingOptions] = useState(false);
    const [selected, setSelected] = useState([]); // Stores the string value of all selected items
    const [trigger, setTrigger] = useState(false);
    const [renderSelected, setRenderSelected] = useState([]);
    const [maxWarning, setMaxWarning] = useState(false);

    useEffect(() => {
        props.updateSubmission(props.id, selected.length > 0? selected:["No Selection"])
    }, [selected.length])

    const selectOption = (option) => {
        if (selected.length < props.max || !props.max) {
            let currentSelected = selected;
            let currentOptions = options;
            
            currentOptions.splice(currentOptions.indexOf(option), 1);
            currentSelected.push(option);
            
            setSelected(currentSelected);
            setOptions(currentOptions)
    
            setIsShowingOptions(false)
            setTrigger(!trigger);
        } else {
            setMaxWarning(true);
            setTimeout(() => setMaxWarning(false), 3000);
        }
    }

    const deselectOption = (option) => {
        let currentSelected = selected;
        let currentOptions = options;

        currentSelected.splice(currentSelected.indexOf(option), 1);
        currentOptions.push(option);

        setSelected(currentSelected);
        setOptions(currentOptions);

        setTrigger(!trigger);
    }

    // for rendering options
    useEffect(() => {
        setOptions(options.sort((a, b) => a.localeCompare(b)));
        let renderArray = [];

        for(let i = 0; i < options.length; i++) {
            if(search === "" || options[i].toLowerCase().includes(search.toLowerCase())) {
                renderArray.push(
                    <div className="dropdown-option-container" onClick={()=>{
                        selectOption(options[i])
                        setIsShowingOptions(false)}}>
                        <div className="dropdown-text-container">
                            {options[i]}
                        </div>
                    </div>
                )
            }
        }

        setRenderOptions(renderArray);

        
        let returnRenderSelected = [];

        for(let j = 0; j < selected.length; j++) {
            returnRenderSelected.push(
                <div onClick={()=>deselectOption(selected[j])} className="selmult-selection">
                    <p>-  {selected[j]}</p>
                </div>
            );
        }

        setRenderSelected(returnRenderSelected)

    }, [search, isShowingOptions, selected, trigger])

    return (
        <div className="block-container" id="block-container">
            <div className={isShowingOptions? "dropdown-defocuser":"hidden"} onClick={() => setIsShowingOptions(false)}></div>
            <p className="heading">{props.heading}</p>
            <p className="subheading">{props.subheading}</p>
            <p className={props.required? "required-star":"hidden"}>*</p>
            <div className={renderSelected.length==0? "hidden":"selmult-selections-container"}>
                {renderSelected}
            </div>
            <p className={maxWarning? "selmult-max-warning":"selmult-max-warning fade"}>You have selected the maximum number of selections.</p>
            <div className={isShowingOptions? "selmult-searchbar super-z":"selmult-searchbar"}>
                <input    
                type="text" 
                placeholder="Search" 
                className="selmult-subbar"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                onFocus={() => setIsShowingOptions(true)} />
                <GoSearch size={15} className="selmult-icon"/>
                <div className={!isShowingOptions||(options.length === 0)? "hidden":"selmult-drop-field"}>
                    <div className="selmult-subdropfield">
                        {isShowingOptions && renderOptions}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SelectMultiple;