"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("./general");
const types_1 = require("./types");
const variableCount = (spawn) => {
    return spawn.memory.hasStorage ? 1 : 0;
};
const rechargerTypes = [
    {
        phase: 4,
        count: 0,
        substitution: 2,
        body: [
            ...Array(16).fill(CARRY),
            ...Array(10).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Recharger
        },
        forAll: true,
        variableCount,
    }
];
const roleRecharger = {
    run: (creep) => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = types_1.Status.Harvesting;
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = types_1.Status.Hauling;
        }
        if (creep.memory.status == types_1.Status.Harvesting) {
            const storage = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_STORAGE
            });
            if (creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage[0]);
            }
            return;
        }
        if (creep.memory.status == types_1.Status.Hauling) {
            const nonFullTargets = (0, general_1.getNonFullTargets)(creep);
            const closestSite = creep.pos.findClosestByRange(nonFullTargets);
            if (closestSite) {
                if (creep.transfer(closestSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSite);
                }
            }
        }
    },
    handleRechargers: (spawn) => {
        (0, general_1.spawnCreep)(spawn, rechargerTypes);
    }
};
module.exports = roleRecharger;
