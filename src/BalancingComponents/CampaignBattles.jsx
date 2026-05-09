import { useEffect, useState } from "react";
import { campaignBattles,battleDataObjects,battleParticipantsObjects } from "../repo";
import { getParsedSession } from "../toStorage";
import Editor from '@monaco-editor/react';
import Refresh from "../svgs/Refresh";
import southBeachImg from '../assets/images/SOUTH BEACH - 1.png';

const CampaignBattles = () =>  {
	const [monacoArray,setMonacoArray] = useState([])
    const [targetBattleBattleIds,setTargetBattleBattleIds] = useState([])
    const [targetBattleParticipantsIds,setTargetBattleParticipantsIds] = useState([])
    const [bpartPool,setBpartPool] = useState([])
    const [battleImg, setImg] = useState(`${import.meta.env.BASE_URL}src/assets/images/SOUTH BEACH - 1.png`);
    const [pigPool,setPigPool] = useState(getParsedSession('pig-pool') || [])

    const [selectedBpart,setBpart] = useState(null)
    const [selectedBattle,setSelectedBattle] = useState(null)
    const [selectedHotspotName,setHotspotName] = useState('South Beach - 1')

    const addParticipantsToPool = (bpart) => {
        let temp = [];
        temp.push(...battleParticipantsObjects.find(f => f.nameId === bpart)
        .battleParticipants
        .map(e => e.nameId))
        setBpartPool(temp)
        setBpart(bpart)
    }

    const isInMonaco = (pigName,bPart) => {
        if (!bPart) return false
        const temp = [...monacoArray]
        const targetBpart = temp.find(f => f.nameId === bPart)
        const targetPig = targetBpart.battleParticipants.findIndex(f => f.nameId === pigName)
        return targetPig !== -1
    }

    const addPigToMonaco = (pigName,bPart) => {
        if (!bPart) {
            alert('Please select a bpart')
            return
        }
        const temp = [...monacoArray]
        const targetBpart = temp.findIndex(f => f.nameId === bPart)
        const targetPig = temp[targetBpart].battleParticipants.findIndex(f => f.nameId === pigName)
        targetPig !== -1 ?
            temp[targetBpart].battleParticipants = temp[targetBpart].battleParticipants.filter(f => f.nameId !== pigName) :
            temp[targetBpart].battleParticipants.push({
                nameId:pigName,
                probability:1,
                amount:1
            });
        sessionStorage.setItem(selectedHotspotName,JSON.stringify(temp))
        setMonacoArray(temp)
    }

    const selectBattle = (e) => {
        let temp = battleDataObjects.find(f => f.nameId === e)
        setTargetBattleParticipantsIds(temp.battleParticipantsIds)
        setSelectedBattle(temp)
    }

    const setBattle = (e) => {
        const cleaned = e.replace(/\[[^\]]*\]/g, '');
        setHotspotName(cleaned)
        setImg(`${import.meta.env.BASE_URL}src/assets/images/${cleaned.toUpperCase().replace(':','')}.png`);
        setBpart(0)
        let temp = []
        temp.push({[`### ${e.toUpperCase()} HOTSPOT ###`]:0})
        temp.push(campaignBattles[e])
        const battleIds = temp[1].battleId
        let battleParticipants = []
        battleIds.forEach(battleId => {
            const targetBattleId = battleDataObjects.find(f => f.nameId === battleId)
            temp.push({[`### ${battleId} ###`]:0})
            temp.push(targetBattleId)
            battleParticipants.push(...targetBattleId.battleParticipantsIds)
        })
        selectBattle(battleIds[0])
        battleParticipants = [...new Set(battleParticipants)]
        battleParticipants.forEach(bpId => {
            const targetTable = battleParticipantsObjects.find(f => f.nameId === bpId)
            temp.push({[`### ${bpId} ###`]:0})
            temp.push(structuredClone(targetTable))
        })
        setTargetBattleBattleIds(battleIds)
        setMonacoArray(temp)
    }

    useEffect(() => {
        setBattle('South Beach - 1')
    },[])

  	return <>
            <div className="flex w-550 nowheel h-200 rounded-b-xl">

                {/* select a battle */}
                <div className="v-box w-100 overflow-y-auto rounded-bl-xl">
                    {Object.keys(campaignBattles).map((e) => (
                        <button
                            className={selectedHotspotName === e.replace(/\[[^\]]*\]/g, '') ? 'gray' : ''}
                            key={`${e}-hotspot`}
                            onClick={() => setBattle(e)}>
                            {e.replace(/\[[^\]]*\]/g, '')}
                        </button>
                    ))}
                </div>

                {/* selected battle information */}
                <div className="w-125">
                    <header className="secondary">{selectedHotspotName.slice(selectedHotspotName.indexOf(':')+1)}'s Position in map</header>
                    <img 
                        src={battleImg} 
                        alt="test" 
                        onError={(e) => {
                            console.log('Failed to load image:', battleImg);
                            console.log('Full URL:', window.location.origin + battleImg);
                        }}
                    />
                    <header className="secondary">battle ids</header>
                    <div className="grid2">
                        {targetBattleBattleIds.map(e => <button onClick={() => selectBattle(e)}>{e}</button>)}
                    </div>
                    <header className="secondary">
                        {selectedBattle ? selectedBattle.nameId : 'No battle selected.'}
                    </header>
                    <div className="grid2">
                        {targetBattleParticipantsIds.map(e => <button onClick={() => addParticipantsToPool(e)}>{e}</button>)}
                    </div>
                </div>

                {/* pigs pool */}
                <div className="w-125 border-l v-box">
                    <div className="flex">
                        <header className="secondary">
                            pigs from pig pool
                        </header>
                        <button
                            onClick={() => setPigPool(getParsedSession('pig-pool') || [])}
                            className="gray rounded-none text-white">
                            <Refresh />
                        </button>
                    </div>
                    <div className="v-box">
                        {pigPool.map(e => <button
                                onClick={() => addPigToMonaco(e,selectedBpart)}
                                className={isInMonaco(e,selectedBpart) ? 'red' : 'gray'}>
                                {e}</button>)}
                    </div>
                    <header className="secondary">
                        {selectedBpart ? `Pigs within ${selectedBpart}` : 'No bpart selected'}
                    </header>
                    <div className="v-box">
                        {selectedBpart ? 
                        bpartPool.map(e => 
                            <button
                                onClick={() => addPigToMonaco(e,selectedBpart)}
                                className={isInMonaco(e,selectedBpart) ? 'red' : 'gray'}>
                                {e}</button>)
                        : <p className="text-white">Select a bpart.</p>}
                    </div>
                </div>

                <div className="w-200 overflow-hidden nodrag rounded-br-xl">
                    <Editor
                        height="100%"
                        className="nokey"
                        value={JSON.stringify(monacoArray, null, 4)}
                        defaultLanguage="json"
                        theme="vs-dark"
                        options={{
                            readOnly:true,
                            readOnlyMessage:'cannot edit this field'
                        }}
                    />
                </div>
            </div>
	</>;
}

export default CampaignBattles;
