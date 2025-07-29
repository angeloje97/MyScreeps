"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep } = require("general");
const upgraderTypes = [
    {
        phase: 2,
        count: 1,
        body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
        memory: {
            role: types_1.Role.Upgrader
        }
    },
    {
        phase: 3,
        count: 1,
        substitution: 2,
        body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
        memory: {
            role: types_1.Role.Upgrader
        }
    }
];
const roleUpgrader = {
    run: (creep) => {
        // if(creep.store[RESOURCE_ENERGY] == 0){
        //     creep.memory.status = Status.Harvesting;
        // }
        // if(creep.store.getFreeCapacity() == 0){
        //     creep.memory.status = Status.Upgrading;
        // }
        // if(creep.memory.status == Status.Harvesting){
        //     const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        //         filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()
        //     })
        //     if(droppedEnergy.length != 0){
        //         const closestEnergy = creep.pos.findClosestByRange(droppedEnergy)
        //         if(closestEnergy){
        //             if(creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE){
        //                 creep.moveTo(closestEnergy)
        //             }
        //         }
        //     }
        // }
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
    handleUpgraders: (spawn) => {
        spawnCreep(spawn, upgraderTypes);
    }
};
module.exports = roleUpgrader;
