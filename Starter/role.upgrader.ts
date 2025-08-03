import { accumulatedCreepType, CreepType, Role, Status } from "./types";

import { spawnCreep, getNonFullTargets } from "./general"

const upgraderTypes: CreepType[] = [
    {
        phase: 2,
        count: 1,
        body: [
            ...Array(3).fill(WORK),
            ...Array(3).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: Role.Upgrader
        }
    },

    {
        phase: 3,
        count: 1,
        substitution: 2,
        body: [
            ...Array(5).fill(WORK),
            ...Array(5).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: Role.Upgrader
        }
    },
    {
        phase: 4,
        count: 1,
        substitution: 2,
        body: [
            ...Array(9).fill(WORK),
            ...Array(5).fill(CARRY),
            ...Array(3).fill(MOVE)
        ],
        memory: {
            role: Role.Upgrader
        },
        forAll: true
    }
]

const roleUpgrader = {
    run: (creep: Creep) => {

        if(creep.store[RESOURCE_ENERGY] == 0){
            const storage = creep.room.find(FIND_STRUCTURES,
                {
                    filter: s => s.structureType == STRUCTURE_STORAGE
                }
            )
            if(storage.length > 0){
                if(storage[0].store[RESOURCE_ENERGY] > Game.spawns[creep.memory.spawn!].memory.minStorageAmount){

                    if(creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(storage[0])
                    }
                }

            }
        }

        const result = creep.upgradeController(creep.room.controller!)
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller!)
        }

        
    },
    handleUpgraders: (spawn: StructureSpawn) => {
        spawnCreep(spawn, upgraderTypes)
    }
}

module.exports = roleUpgrader;