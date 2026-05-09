import decoded_locale from '../assets/decoded_locale.json'

import BattleBalancing from '../assets/ABH.Shared.BalancingData.BattleBalancingData.json'
import BattleParticipantTableBalancing from '../assets/ABH.Shared.BalancingData.BattleParticipantTableBalancingData.json'
import HotspotBalancing from '../assets/ABH.Shared.BalancingData.HotspotBalancingData.json'
import PigBalancing from '../assets/ABH.Shared.BalancingData.PigBalancingData.json'

/*
To have your mod supported by it, replace the json files inside /assets with your mod's files

To get rid of 'undefined' battles, remove the _wave battle hotspots zoneLocaIdent in HotspotBalancing.json.
*/

// localization
export const locale = structuredClone(decoded_locale.texts)

// Battle balancing data
export const battleDataObjects = structuredClone(BattleBalancing.battleData)
export const battleDataCodenames = battleDataObjects.map(e => e.nameId)

// Battle participants data
export const battleParticipantsObjects = structuredClone(BattleParticipantTableBalancing.battleParticipantTableData)
export const battleParticipantsCodenames = battleParticipantsObjects.map(e => e.nameId)

// Pigs data
export const pigs = structuredClone(PigBalancing.pigData)
export const pigAssets = [...new Set(pigs.map(e => e.assetId))]
export const pigCodenames = pigs.map(e => e.nameId)
export const pigIngameName = [...new Set(pigs.map(e => e.locaId).map(e => locale.find(f => f.nameId === `${e}_name`)).filter(f => f))]

// Hotstops data
export const hotspotObjects = structuredClone(HotspotBalancing.hotspotData)
export const hotspotBattles = hotspotObjects.filter(f => f.type === 'BATTLE').slice(1,176)
export const hotspotZones = [...new Set(hotspotObjects.map(e => e.zoneLocaIdent))]
export const ingameZoneName = Object.fromEntries(
    hotspotZones.map(e => [e,locale.find(f => f.nameId === e)?.translatedText])
    .filter(f => f[1])
    .filter(f => !f[0].startsWith('campaign'))
)
export const zoneNames = [...new Set(Object.keys(ingameZoneName).map(e => ingameZoneName[e]))]

let battleZoneCounter = {}

hotspotBattles.forEach(e => {
    const zone = e.zoneLocaIdent;
    battleZoneCounter[zone] = 1;
})

export const campaignBattles =  Object.fromEntries(
    hotspotBattles.map(battle => {
        const zone = battle.zoneLocaIdent;

        let num = battleZoneCounter[zone];
        if (zone.endsWith('_wave')){
            num = battleZoneCounter[zone.slice(0,-5)]
            battleZoneCounter[zone.slice(0,-5)] += 1;
        }
        battleZoneCounter[zone] += 1;

        if (!num) {
            num = battleZoneCounter[zone] - 1
        }

        const ingameHotspotName = `${ingameZoneName[zone]}${` - ${num}`}`

        return [ingameHotspotName,battle]
    })
)
