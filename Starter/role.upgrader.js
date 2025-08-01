"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const general_1 = require("./general");
const upgraderTypes = [
    {
        phase: 2,
        count: 1,
        body: [
            ...Array(3).fill(WORK),
            ...Array(3).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Upgrader
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
            role: types_1.Role.Upgrader
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
            role: types_1.Role.Upgrader
        },
        forAll: true
    }
];
const roleUpgrader = {
    run: (creep) => {
        const result = creep.upgradeController(creep.room.controller);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
    handleUpgraders: (spawn) => {
        (0, general_1.spawnCreep)(spawn, upgraderTypes);
    }
};
module.exports = roleUpgrader;
