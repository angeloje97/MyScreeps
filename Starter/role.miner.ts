import { run } from "node:test";
import { CreepType, Role, accumulatedCreepType } from "./types";

const {spawnCreep} = require('general')

const minerTypes: CreepType[] =  [
    {
        phase: 2,
        count: 2,
        body: [WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: Role.Miner
        }
    },
    {
        phase: 3,
        count: 2,
        substitution: 2,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: Role.Miner
        }
    },
    {
        phase: 4,
        count: 2,
        substitution: 3,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: Role.Miner
        }
    }
]

const roleMiner = {
    run: (creep: Creep) => {
        const sources = creep.room.find(FIND_SOURCES)

        const source = sources[creep.memory.index! % sources.length]

        if(creep.harvest(source) == ERR_NOT_IN_RANGE){
            creep.moveTo(source);
        }

        if(creep.store.getFreeCapacity() == 0){
            creep.drop(RESOURCE_ENERGY)
        }

    },

    handleMiner: (spawn: StructureSpawn) => {

            spawnCreep(spawn, minerTypes)

    },
}

module.exports = roleMiner;