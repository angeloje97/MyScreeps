"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const general_1 = require("./general");
const variableCount = (spawn) => {
    const threats = spawn.memory.threats;
    if (threats.length > 0) {
        return 1;
    }
    return 0;
};
const knightTypes = [
    {
        phase: 4,
        count: 1,
        body: (0, general_1.BodyParts)([
            { part: TOUGH, amount: 4, ignorePatterns: true },
            { part: ATTACK, amount: 4 },
            { part: MOVE, amount: 4 }
        ]),
        memory: {
            role: types_1.Role.Knight,
        },
        forAll: true,
        variableCount,
    }
];
const roleKnight = {
    run: (creep) => {
        const threats = Game.spawns[creep.memory.spawn].memory.threats;
        if (threats.length == 0) {
            creep.moveTo(Game.spawns[creep.memory.spawn]);
            return;
        }
        if (creep.attack(threats[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(threats[0]);
        }
    },
    handleKnights: (spawn) => {
        (0, general_1.spawnCreep)(spawn, knightTypes);
    },
};
module.exports = roleKnight;
