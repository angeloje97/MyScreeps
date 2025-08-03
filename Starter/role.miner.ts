import { run } from "node:test";
import { CreepType, Direction, Role, accumulatedCreepType } from "./types";

import { spawnCreep, getNonFullTargets, adjacentRoom } from "./general"

const variableCount = (spawn: StructureSpawn): number => {

    const hasStorage = spawn.room.find(FIND_STRUCTURES,
    { 
        filter : s => s.structureType == STRUCTURE_STORAGE
    }).length > 0

    if(hasStorage){
        return spawn.memory.miningNodes.sources.length;
    }

    return spawn.room.find(FIND_SOURCES).length;
}



const minerTypes: CreepType[] =  [
    {
        phase: 2,
        count: 2,
        body: [
            ...Array(5).fill(WORK),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: Role.Miner
        },
        variableCount,
    },
    {
        phase: 3,
        count: 2,
        substitution: 2,
        body: [
            ...Array(7).fill(WORK),
            ...Array(2).fill(MOVE)
        ],
        memory: {
            role: Role.Miner
        },
        variableCount,
    },
    {
        phase: 4,
        count: 2,
        substitution: 3,
        body: [
            ...Array(7).fill(WORK),
            ...Array(7).fill(MOVE)
        ],
        memory: {
            role: Role.Miner
        },

        variableCount,

        forAll: true,
    }
]

const roleMiner = {
    run: (creep: Creep) => {

        const sources = Game.spawns[creep.memory.spawn!].memory.miningNodes.sources
        
        
        const source = sources[creep.memory.index! % sources.length]
        const result = creep.harvest(source)
        if(result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES){
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