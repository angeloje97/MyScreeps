"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep, getNonFullTargets } = require("./spawnerHelper");
const haulerTypes = [
    {
        phase: 2,
        count: 1,
        name: "Hauler",
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        memory: {
            role: "hauler",
            status: types_1.Status.Harvesting,
        },
    },
    {
        phase: 3,
        count: 1,
        substitution: 2,
        name: "Hauler",
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        memory: {
            role: "hauler",
            status: types_1.Status.Harvesting,
        },
    }
];
const roleHauler = {
    run: (creep) => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = types_1.Status.Harvesting;
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = types_1.Status.Hauling;
        }
        if (creep.memory.status == types_1.Status.Harvesting) {
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()
            });
            const closestEnergy = creep.pos.findClosestByRange(droppedEnergy);
            if (closestEnergy) {
                if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnergy);
                }
            }
        }
        if (creep.memory.status == types_1.Status.Hauling) {
            const nonFullTargets = getNonFullTargets(creep);
            const closestSite = creep.pos.findClosestByRange(nonFullTargets);
            if (closestSite) {
                if (creep.transfer(closestSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSite);
                }
            }
            else {
                creep.memory.status = types_1.Status.Helping;
            }
        }
        if (creep.memory.status == types_1.Status.Helping) {
            const otherCreeps = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    if (c.memory.role != 'upgrader')
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
        spawnCreep(spawn, haulerTypes);
    }
};
module.exports = roleHauler;
