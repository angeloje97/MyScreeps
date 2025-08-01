"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const general_1 = require("./general");
const variableCount = (spawn) => {
    return spawn.room.find(FIND_SOURCES).length;
};
const minerTypes = [
    {
        phase: 2,
        count: 2,
        body: [
            ...Array(5).fill(WORK),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Miner
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
            role: types_1.Role.Miner
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
            role: types_1.Role.Miner
        },
        variableCount,
        forAll: true,
    }
];
const roleMiner = {
    run: (creep) => {
        const sources = creep.room.find(FIND_SOURCES);
        const source = sources[creep.memory.index % sources.length];
        const result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.moveTo(source);
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.drop(RESOURCE_ENERGY);
        }
    },
    handleMiner: (spawn) => {
        (0, general_1.spawnCreep)(spawn, minerTypes);
    },
};
module.exports = roleMiner;
