"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGrunt = void 0;
const types_1 = require("./types");
const general_1 = require("./general");
const gruntTypes = [
    {
        phase: 1,
        count: 4,
        body: [
            ...Array(1).fill(WORK),
            ...Array(1).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Grunt,
        }
    },
    {
        phase: 2,
        count: 4,
        substitution: 1,
        body: [
            ...Array(3).fill(WORK),
            ...Array(2).fill(CARRY),
            ...Array(3).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Grunt,
        }
    },
    {
        phase: 3,
        count: 3,
        substitution: 2,
        body: [
            ...Array(4).fill(WORK),
            ...Array(4).fill(CARRY),
            ...Array(4).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Grunt,
        }
    },
    {
        phase: 4,
        count: 2,
        substitution: 2,
        body: [
            ...Array(6).fill(WORK),
            ...Array(6).fill(CARRY),
            ...Array(8).fill(MOVE)
        ],
        memory: {
            role: types_1.Role.Grunt,
        },
        forAll: true,
    }
];
exports.roleGrunt = {
    run: (creep) => {
        const isEmpty = creep.store[RESOURCE_ENERGY] == 0;
        const isFull = creep.store.getFreeCapacity() == 0;
        const nonFullTowers = (0, general_1.getNonFullTargets)(creep);
        const sources = creep.room.find(FIND_SOURCES);
        const controller = creep.room.controller;
        const { index } = creep.memory;
        if (isEmpty) {
            creep.memory.status = types_1.Status.Harvesting;
        }
        else if (isFull) {
            creep.memory.status = types_1.Status.Hauling;
        }
        //#region Harvesting
        if (creep.memory.status == types_1.Status.Harvesting) {
            let sourceIndex = 0;
            let dropIndex = 0;
            const storage = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_STORAGE
            });
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()
            });
            if (index) {
                sourceIndex = index % sources.length;
                dropIndex = index % droppedEnergy.length;
            }
            if (storage.length > 0 && storage[0].store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
                if (creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage[0]);
                }
            }
            else if (droppedEnergy.length == 0) {
                if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[sourceIndex]);
                }
            }
            else if (droppedEnergy.length > 0) {
                if (creep.pickup(droppedEnergy[dropIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[dropIndex]);
                }
            }
        }
        //#endregion
        //#region Hauling
        if (creep.memory.status == types_1.Status.Hauling) {
            const haulers = creep.room.find(FIND_MY_CREEPS, {
                filter: c => c.memory.role == types_1.Role.Hauler
            });
            if (nonFullTowers.length > 0 && haulers.length == 0) {
                const closestTower = creep.pos.findClosestByRange(nonFullTowers);
                if (creep.transfer(closestTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTower);
                }
            }
            else {
                creep.memory.status = types_1.Status.Building;
            }
        }
        //#endregion
        // #region Building
        if (creep.memory.status == types_1.Status.Building) {
            const prioritySites = [STRUCTURE_EXTENSION, STRUCTURE_ROAD];
            const sites = [];
            for (const prio of prioritySites) {
                const prioSite = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (site) => site.structureType == prio
                });
                const closest = creep.pos.findClosestByRange(prioSite);
                if (closest) {
                    sites.push(closest);
                }
            }
            const other = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (s) => !prioritySites.includes(s.structureType),
            });
            const closestOther = creep.pos.findClosestByPath(other);
            if (closestOther) {
                sites.push(closestOther);
            }
            if (sites.length > 0) {
                const closesSite = sites[0];
                if (closesSite) {
                    if (creep.build(closesSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closesSite);
                    }
                }
            }
            else {
                creep.memory.status = types_1.Status.Upgrading;
            }
        }
        //#endregion
        //#region Upgrading
        if (creep.memory.status == types_1.Status.Upgrading) {
            if (controller) {
                if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
        //#endregion
    },
    handleGrunt: (spawn) => {
        (0, general_1.spawnCreep)(spawn, gruntTypes);
    }
};
module.exports = exports.roleGrunt;
