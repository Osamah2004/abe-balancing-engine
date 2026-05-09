import decoded_locale from './assets/decoded_locale.json'

import BattleBalancing from './assets/ABH.Shared.BalancingData.BattleBalancingData.json'
import BattleParticipantTableBalancing from './assets/ABH.Shared.BalancingData.BattleParticipantTableBalancingData.json'
import HotspotBalancing from './assets/ABH.Shared.BalancingData.HotspotBalancingData.json'
import PigBalancing from './assets/ABH.Shared.BalancingData.PigBalancingData.json'
import { Editor } from '@monaco-editor/react'
import { useState } from 'react'
import Refresh from './svgs/Refresh'



const download = (content,filename) => {
    // 1. Create a Blob with the text and specify the MIME type
    const stringified = JSON.stringify(content,null,4)
    const blob = new Blob([stringified], { type: 'text/json' });

    // 2. Generate a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 3. Create a hidden anchor element and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // The name of the file to be saved
    
    document.body.appendChild(a);
    a.click(); // Programmatically click the link
    
    // 4. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Free up memory 
}

const ChangesReview = () => {
    const [monacoCode,setMonacoCode] = useState({"Disclaimer":"For the moment, only bpart modifications are supported"})
    const [battles,setBattles] = useState(structuredClone(BattleBalancing))
    const [participants,setParticipants] = useState(structuredClone(BattleParticipantTableBalancing))
    

    const refresh = () => {
        let modifiedLevels = Object.fromEntries(
        Object.keys(sessionStorage).map(key => [
                key,
                JSON.parse(sessionStorage.getItem(key))
            ])
        );
        modifiedLevels = Object.keys(modifiedLevels).map(e => {
            return modifiedLevels[e].filter(f => f.nameId)
        })
        delete modifiedLevels['pig-pool'];

        let battlesTemp = structuredClone(battles)
        let participantsTemp = structuredClone(participants)

        Object.keys(modifiedLevels).forEach(level => {
            const bparts = modifiedLevels[level].filter(f => f.nameId.startsWith('bpart'))

            bparts.forEach(bpart => {
                let targetIndex = participantsTemp.battleParticipantTableData
                    .findIndex(f => f.nameId === bpart.nameId);
                participantsTemp.battleParticipantTableData[targetIndex] = bpart;
            });
        })
        setParticipants(participantsTemp)
        setBattles(battlesTemp)
        if (monacoCode.battleParticipantTableData){
            setMonacoCode(participantsTemp)
        }
        else setMonacoCode(battlesTemp)
    }
    return (
        <div className="bg-gray-800 h-[80vh] w-[80vw] flex">
            <div className="w-3/10 bg-gray-700 relative v-box">
                <div className="flex">
                    <header className="secondary">Files</header>
                    <button onClick={() => refresh()} className='gray rounded-none'>
                        <Refresh />
                    </button>
                </div>
                <button onClick={() => setMonacoCode(battles)}>BattleBalancingData</button>
                <button onClick={() => setMonacoCode(participants)}>BattleParticipantTableBalancing</button>

                <footer className='absolute bg-cyan-700 w-full p-2 bottom-0'>
                    <button
                        onClick={() => download(participants,'ABH.Shared.BalancingData.BattleParticipantTableBalancingData.json')}
                        className='text-lg'>download battle participants</button>
                </footer>
            </div>

            <div className="w-7/10">
                <Editor
                    value={JSON.stringify(monacoCode,null,4)}
                    language='json'
                    theme='vs-dark'
                    options={{
                        readOnly:true,
                        readOnlyMessage:'cannot edit this field'
                    }}
                />
            </div>
        </div>
)}
export default ChangesReview;