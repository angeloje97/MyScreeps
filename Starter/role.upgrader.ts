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
            ...Array(10).fill(WORK),
            ...Array(5).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: Role.Upgrader
        },
        forAll: true
    }
]

const roleUpgrader = {
    run: (creep: Creep) => {

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