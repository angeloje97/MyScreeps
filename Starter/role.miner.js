"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep } = require('general');
const minerTypes = [
    {
        phase: 2,
        count: 2,
        body: [WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: types_1.Role.Miner
        }
    },
    {
        phase: 3,
        count: 2,
        substitution: 2,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: types_1.Role.Miner
        }
    },
    {
        phase: 4,
        count: 2,
        substitution: 3,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
        memory: {
            role: types_1.Role.Miner
        }
    }
];
const roleMiner = {
    run: (creep) => {
        const sources = creep.room.find(FIND_SOURCES);
        const source = sources[creep.memory.index % sources.length];
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.drop(RESOURCE_ENERGY);
        }
    },
    handleMiner: (spawn) => {
        spawnCreep(spawn, minerTypes);
    },
};
module.exports = roleMiner;
