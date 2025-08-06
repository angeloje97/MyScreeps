import { run } from "node:test";
import { accumulatedCreepType, CreepType, Role } from "./types";


import { spawnCreep, getNonFullTargets, BodyParts } from "./general"

const variableCount = (spawn: StructureSpawn) => {
    const threats = spawn.memory.threats;

    if(threats.length > 0){
        return 1;
    }

    return 0;
}

const knightTypes: CreepType[] = [
    {
        phase: 4,
        count: 1,
        body: BodyParts([
            { part: TOUGH, amount: 4, ignorePatterns: true},
            { part: ATTACK, amount: 4},
            { part: MOVE, amount: 4}
        ]),
        memory: {
            role: Role.Knight,
        },

        forAll: true,

        variableCount,
    }
]


const roleKnight = {
    run: (creep: Creep):void => {
        const threats = Game.spawns[creep.memory.spawn!].memory.threats;
        if(threats.length == 0){
            creep.moveTo(Game.spawns[creep.memory.spawn!])
            return;
        }

        if(creep.attack(threats[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(threats[0])
        }

    },
    handleKnights: (spawn: StructureSpawn):void => {
        spawnCreep(spawn, knightTypes);
    },
};

module.exports = roleKnight;