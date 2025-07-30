"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const knightTypes = [
    {
        phase: 2,
        count: 2,
        body: [MOVE, ATTACK, MOVE, ATTACK],
        memory: {
            role: types_1.Role.Knight,
        }
    }
];
const roleKnight = {
    run: (creep) => {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile);
            }
        }
    },
    handleKnights: (spawn) => {
        // spawnCreep(spawn, accumulatedCreepType(Game.spawns['Spawn1'].room.controller?.level || 1, knightTypes))
    },
};
module.exports = roleKnight;
