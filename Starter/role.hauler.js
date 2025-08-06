"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const general_1 = require("./general");
const variableCount = (spawn) => {
    if (!spawn.memory.hasStorage) {
        return 1;
    }
    return spawn.memory.miningNodes.sources.length - 1;
};
const haulerTypes = [
    {
        phase: 2,
        count: 2,
        body: (0, general_1.BodyParts)([
            { amount: 6, part: CARRY },
            { amount: 5, part: MOVE },
        ]),
        memory: {
            role: types_1.Role.Hauler,
            status: types_1.Status.Harvesting,
        },
    },
    {
        phase: 3,
        count: 2,
        substitution: 2,
        body: (0, general_1.BodyParts)([
            { amount: 10, part: CARRY },
            { amount: 6, part: MOVE },
        ]),
        memory: {
            role: types_1.Role.Hauler,
            status: types_1.Status.Harvesting,
        },
    },
    {
        phase: 4,
        count: 1,
        substitution: 2,
        body: (0, general_1.BodyParts)([
            { amount: 16, part: CARRY },
            { amount: 10, part: MOVE },
        ]),
        memory: {
            role: types_1.Role.Hauler,
            status: types_1.Status.Harvesting,
        },
        forAll: true,
        variableCount,
    }
];
const roleHauler = {
    run: (creep) => {
        const { index } = creep.memory;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = types_1.Status.Harvesting;
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = types_1.Status.Hauling;
        }
        if (creep.memory.status == types_1.Status.Harvesting) {
            const tombstones = creep.room.find(FIND_TOMBSTONES, {
                filter: t => t.store[RESOURCE_ENERGY] > 0 // or any resource you want
            });
            if (tombstones.length > 0 && creep.memory.index == 0) {
                const tombstone = tombstones[0]; // or use findClosestByPath for efficiency
                if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstone);
                }
                return;
            }
            const droppedEnergy = Game.spawns[creep.memory.spawn].memory.drops.sources;
            let dropIndex = creep.memory.index;
            if (dropIndex > 0) {
                dropIndex += 1;
            }
            if (droppedEnergy.length > 0) {
                if (creep.pickup(droppedEnergy[dropIndex % droppedEnergy.length]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[dropIndex % droppedEnergy.length]);
                }
            }
            return;
        }
        if (creep.room.name != Game.spawns[creep.memory.spawn].room.name || (creep.ticksToLive && creep.ticksToLive < 30)) {
            creep.moveTo(Game.spawns[creep.memory.spawn]);
            if (creep.ticksToLive && creep.ticksToLive < 3) {
                creep.drop(RESOURCE_ENERGY);
            }
            return;
        }
        if (creep.memory.status == types_1.Status.Hauling) {
            const nonFullTargets = (0, general_1.getNonFullTargets)(creep);
            const closestSite = creep.pos.findClosestByRange(nonFullTargets);
            const hasRecharger = (0, general_1.creepsExists)(Game.spawns[creep.memory.spawn], [types_1.Role.Recharger]);
            if (closestSite && !hasRecharger) {
                if (creep.transfer(closestSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSite);
                }
            }
            else {
                creep.memory.status = types_1.Status.Storing;
            }
        }
        if (creep.memory.status == types_1.Status.Storing) {
            const storage = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_STORAGE });
            if (storage.length != 0 && storage[0].store.getFreeCapacity() > 0) {
                if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage[0]);
                }
            }
            else {
                creep.memory.status = types_1.Status.Helping;
            }
        }
        if (creep.memory.status == types_1.Status.Helping) {
            const otherCreeps = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    if (c.memory.role != types_1.Role.Upgrader)
                        return false;
                    const moreThanHalf = c.store.getFreeCapacity() <= c.store.getCapacity() / 2;
                    if (moreThanHalf)
                        return false;
                    return true;
                }
            });
            const closestCreep = creep.pos.findClosestByRange(otherCreeps);
            if (closestCreep) {
                if (creep.transfer(closestCreep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestCreep);
                }
            }
            else {
                creep.memory.status = types_1.Status.Harvesting;
            }
        }
    },
    handleHaulers: (spawn) => {
        (0, general_1.spawnCreep)(spawn, haulerTypes);
    }
};
module.exports = roleHauler;
