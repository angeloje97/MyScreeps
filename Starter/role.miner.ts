import { run } from "node:test";
import { CreepType } from "./types";

const minerType: CreepType[] =  [
    {
        phase: 2,
        count: 3,
        body: [WORK, WORK, WORK, WORK, MOVE],
        name: "Harvester",
        memory: {
            role: "harvester"
        }
    }
]

const roleMiner = {
    run: (creep: Creep) => {},

    handleHarvester: (spawnName: string) => {
        
    },
}

module.exports = roleMiner;