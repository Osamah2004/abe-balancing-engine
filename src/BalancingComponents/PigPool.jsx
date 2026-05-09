import { pigAssets, pigs, pigIngameName } from "../repo"
import { useState, useEffect } from "react"
import { Editor } from "@monaco-editor/react"
import Bin from "../svgs/Bin.jsx"
import { getParsedSession } from "../toStorage.js"

const PigPool = () => {
    const pigArray = structuredClone(pigs.map(e => e.nameId))
    const [filtered,setFiltered] = useState(pigArray)
    const [pool,setPool] = useState(getParsedSession('pig-pool') || [])
    const [monacoArray,setMonacoArray] = useState([])

    useEffect(() => {
        sessionStorage.setItem('pig-pool',JSON.stringify(pool))
    },[pool])

    const setPig = (e) => {
        let temp = []
        temp.push(pigs.find(f => f.nameId === e))
        setMonacoArray(temp)
    }

    const addPig = (e) => {
        pool.includes(e) ?
        setPool(pool.filter(f => f !== e)) :
        setPool([...pool,e]);
        setPig(e)
    }

    const onSearch = (e) => {
        if (e.trim() === '') setFiltered(structuredClone(pigArray));
        else setFiltered(pigArray.filter(f => f.includes(e)))
    }

    const filterByAsset = (e) => {
        if (e === 'reset') setFiltered(pigArray);
        else setFiltered(pigs.filter(f => f.assetId === e).map(e => e.nameId))
    }

    const filterByIngameName = (e) => {
        if (e === 'reset') setFiltered(pigArray);
        else setFiltered(pigs.filter(f => f.locaId === e.replace('_name','')).map(e => e.nameId))
    }

    return (
        <div className="w-350 h-150 flex">
            <div className="v-box nowheel rounded-b-xl w-100">
                {filtered.map(e => <button
                    className={pool.includes(e) ? 'red' : ''}
                    onClick={() => addPig(e)}
                    key={`pig-${e}`}>{e}</button>)}
            </div>
            
            <div className="block w-100 v-box nowheel">
                <header className="secondary">filters</header>
                <label htmlFor="search-pig" className="group">search: 
                    <input className="group-hover:border-cyan-600" onChange={(e) => onSearch(e.target.value)} type="text" id="search-pig"/>
                </label>
                <label htmlFor="filter-asset" className="group">
                    filter by pigAsset:
                    <select onChange={(e) => filterByAsset(e.target.value)} name="filter-asset" id="filter-asset" className="group-hover:bg-cyan-600 w-32">
                        <option value="reset">-</option>
                        {pigAssets.map(e => <option value={e}>{e}</option>)}
                    </select>
                </label>
                <label htmlFor="filter-asset" className="group">
                    filter by in-game name:
                    <select onChange={(e) => filterByIngameName(e.target.value)} name="filter-asset" id="filter-asset" className="group-hover:bg-cyan-600 w-32">
                        <option value="reset">-</option>
                        {pigIngameName.map(e => <option value={e.nameId}>{e.translatedText}</option>)}
                    </select>
                </label>
                <div className="flex">
                <header className="secondary relative">
                    pig pool
                </header>
                <button onClick={() => setPool([])} className="red rounded-none">
                    <Bin />
                </button>
                </div>
                    {pool.map(e =>
                        <div className="flex px-4">
                            <button className="relative w-19/20 capsule-left" onClick={() => setPig(e)}>
                                {e}
                            </button>
                            <button onClick={() => addPig(e)} className="red capsule-right">
                                <Bin />
                            </button>
                        </div>
                    )}
            </div>

            <div className="w-150 overflow-hidden rounded-br-xl">
                <Editor
                    height="100%"
                    className="nokey"
                    value={JSON.stringify(monacoArray, null, 4)}
                    defaultLanguage="json"
                    defaultValue="// start coding..."
                    theme="vs-dark"
                    options={{
                        readOnly:true,
                        readOnlyMessage:'cannot edit this field'
                    }}
                />
            </div>
        </div>
    )
}

export default PigPool