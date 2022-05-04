import React, { useEffect, useState, useMemo } from "react";
import "./Notes.scoped.css";
import { BsPersonFill } from "react-icons/bs";
import { IoClipboard } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import MockNotes from "./MockNotes.js";

function Notes() {
    const [notesIndv, setNotesIndv] = useState(JSON.parse(localStorage.getItem("notes-individual")) || MockNotes);
    const [notesIndvRenders, setNotesIndvRenders] = useState();
    const [notesQuick, setNotesQuick] = useState(JSON.parse(localStorage.getItem("notes-quick")) || "Bruh");
    const [options, setOptions] = useState(notesIndv.map(item => item.delegate));
    const [search, setSearch] = useState('');
    const [renderOptions, setRenderOptions] = useState([]);
    const [isShowingOptions, setIsShowingOptions] = useState(false);
    const [selected, setSelected] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [renderSelected, setRenderSelected] = useState([]);

    // Keeps notes in sync with delegations list
    useEffect(() => {
        let newDelList = JSON.parse(localStorage.getItem("delegations")).map(item => item.name);
        let oldDelList = notesIndv.slice().map(item => item.delegate);

        // Determining what delegates were added/removed
        let toDelete = [];
        let toAdd = [];
        for (let i=0; i<newDelList.length; i++) {
            let newItem = newDelList[i];
            if (!oldDelList.includes(newItem)) toAdd.push(newItem);
        }
        for (let i=0; i<oldDelList.length; i++) {
            let oldItem = oldDelList[i];
            if (!newDelList.includes(oldItem)) toDelete.push(oldItem);
        }

        // Updating the notes list
        let newNotesList = notesIndv;
        for (let i=0; i<newNotesList.length; i++) {
            if (toDelete.includes(newNotesList[i].delegate)) newNotesList.splice(i, 1);
        }
        for (let j=0; j<toAdd.length; j++) {
            newNotesList.push({
                id: newNotesList.length + j + 1,
                delegate: toAdd[j],
                text: ""
            })
        }
        newNotesList.sort((a, b) => a.delegate.toLowerCase().localeCompare(b.delegate.toLowerCase()));
        setNotesIndv(newNotesList);

        // Updating the options list
        let newOptionsList = options.slice();
        for (let i=0; i<newOptionsList.length; i++) {
            if (toDelete.includes(newOptionsList[i])) newOptionsList.splice(i, 1);
        }
        newOptionsList = newOptionsList.concat(toAdd);
        newOptionsList.sort();
        setOptions(newOptionsList);

    }, [localStorage.getItem("delegations")])

    function updateNotes(index, newText) {
        let tempArr = notesIndv.slice();
        tempArr[index].text = newText;
        setNotesIndv(tempArr);
    }

    const selectOption = (option) => {
        let currentSelected = selected;
        let currentOptions = options;
        
        currentOptions.splice(currentOptions.indexOf(option), 1);
        currentSelected.push(option);
        
        setSelected(currentSelected);
        setOptions(currentOptions)

        setIsShowingOptions(false)
        setTrigger(!trigger);
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
                    <div className="dropdown-option-container" onClick={() => {
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

        for (let j = 0; j < selected.length; j++) {
            returnRenderSelected.push(
                <div onClick={()=>deselectOption(selected[j])} className="selection">
                    <p>-  {selected[j]}</p>
                </div>
            );
        }

        setRenderSelected(returnRenderSelected)

    }, [search, isShowingOptions, selected, trigger])

    useEffect(() => {
        let tempArr = [];
        for (let i=0; i<notesIndv.length; i++) {
            let note = notesIndv[i];
            if (selected.length == 0 || selected.includes(note.delegate)) {
                tempArr.push(
                    <div className="noteblock-container">
                        <p className="noteblock-title">{note.delegate}</p>
                        <textarea id={`textfield ${note.id}`} type="text" placeholder="Input here..." className="noteblock-textfield" value={note.text} onChange={() => updateNotes(note.id, document.getElementById(`textfield ${note.id}`).value)}></textarea>
                    </div>
                )
            }
        }

        setNotesIndvRenders(tempArr);
    }, [selected.length, notesIndv])

    useEffect(() => {
        localStorage.setItem("notes-individual", JSON.stringify(notesIndv));
        dispatchEvent(new Event("individual notes updated"));
    }, [notesIndv])

    useEffect(() => {
        localStorage.setItem("notes-quick", JSON.stringify(notesQuick));
        dispatchEvent(new Event("quick notes updated"));
    }, [notesQuick])

    return (
        <div className="page-container">
            <div className="UI-left">
                <div className="UI-left-top">
                    <div className="header-pair">
                        <BsPersonFill className="person-icon"/>
                        <p className="header-text">Individual Notes</p>
                    </div>

                    <div className={isShowingOptions? "dropdown-defocuser":"hidden"} onClick={() => setIsShowingOptions(false)}></div>
                    <div className={isShowingOptions? "searchbar super-z":"searchbar"}>
                        <input type="text" placeholder="Search" className="subbar" value={search} onChange={(e)=>setSearch(e.target.value)} onFocus={() => setIsShowingOptions(true)}/>
                        <GoSearch size={15} className="icon"/>
                        <div className={!isShowingOptions||(options.length === 0)? "hidden":"drop-field"}>
                            <div className="subdropfield">
                                {isShowingOptions && renderOptions}
                            </div>
                        </div>
                    </div>
                    <div className={renderSelected.length==0? "hidden":"selections-container"}>
                        {renderSelected}
                    </div>

                </div>

                <div className="notes-container">
                    {notesIndvRenders}
                </div>
            </div>

            <div className="UI-right">
                <div className="header-pair">
                    <IoClipboard className="person-icon"/>
                    <p className="header-text">Quick Notes</p>
                </div>

                <textarea type="text" placeholder="Input here..." value={notesQuick} onChange={e => setNotesQuick(e.target.value)} className="UI-right-input"></textarea>
            </div>
        </div>
    )
}


export default Notes;