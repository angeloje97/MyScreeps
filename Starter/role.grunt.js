"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep, getNonFullTargets } = require("spawnerHelper");
const gruntTypes = [
    {
        phase: 1,
        count: 4,
        name: "Grunt",
        body: [WORK, CARRY, MOVE],
        memory: {
            role: "grunt",
        }
    },
    {
        phase: 2,
        count: 4,
        substitution: 1,
        name: "Grunt",
        body: [WORK, WORK, CARRY, CARRY, MOVE],
        memory: {
            role: "grunt",
        }
    },
    {
        phase: 3,
        count: 3,
        substitution: 2,
        name: "Grunt",
        body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        memory: {
            role: "grunt",
        }
    }
];
const roleGrunt = {
    run: (creep) => {
        const isEmpty = creep.store[RESOURCE_ENERGY] == 0;
        const isFull = creep.store.getFreeCapacity() == 0;
        const nonFullTowers = getNonFullTargets(creep);
        const sources = creep.room.find(FIND_SOURCES);
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
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
            if (index) {
                sourceIndex = index % sources.length;
            }
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()
            });
            if (droppedEnergy.length == 0) {
                if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[sourceIndex]);
                }
            }
            else {
                const closestEnergy = creep.pos.findClosestByRange(droppedEnergy);
                if (closestEnergy) {
                    if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestEnergy);
                    }
                }
            }
        }
        //#endregion
        //#region Hauling
        if (creep.memory.status == types_1.Status.Hauling) {
            const haulers = creep.room.find(FIND_MY_CREEPS, {
                filter: c => c.memory.role == 'hauler'
            });
            if (nonFullTowers.length > 0 && haulers.length == 0) {
                if (creep.transfer(nonFullTowers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nonFullTowers[0]);
                }
            }
            else {
                creep.memory.status = types_1.Status.Building;
            }
        }
        //#endregion
        // #region Building
        if (creep.memory.status == types_1.Status.Building) {
            if (sites.length > 0) {
                const closesSite = creep.pos.findClosestByRange(sites);
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
        spawnCreep(spawn, gruntTypes);
    }
};
module.exports = roleGrunt;
