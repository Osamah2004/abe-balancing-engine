import { useSetAtom } from "jotai";
import { ModalChild } from "./Atom";
import { useState } from "react";
import ChangesReview from "./ChangesReview";

const TopHeader = () =>  {
    const setChildModal = useSetAtom(ModalChild);
    // TopHeader.jsx
    const [modalKey, setModalKey] = useState(0)

    const openModal = () => {
        setModalKey(prev => prev + 1)
        setChildModal(<ChangesReview key={modalKey} />)
    }
    return (
    <header
        id="top-header"
        className="p-2 bg-gray-950/60 fixed top-0 w-full
        font-mono text-4xl flex">
        <p className="text-white pr-2">ABE balancing engine v0.1</p>
        <button onClick={() => openModal()}>view</button>
    </header>
)}

export default TopHeader;