"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep } = require("spawnerHelper");
const phase = 1;
const upgraderTypes = [
    {
        phase: 1,
        count: 2,
        body: [WORK, CARRY, MOVE],
        name: "Upgrader" + Game.time,
        memory: {
            role: "upgrader",
            status: types_1.Status.Harvesting,
        },
    },
];
const roleUpgrader = {
    run: (creep) => {
        const maxCarry = creep.body.filter((part) => part.type === CARRY).length * 50;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            if (creep.memory.status != types_1.Status.Harvesting)
                creep.memory.status = types_1.Status.Harvesting;
            creep.say("Harvesting");
        }
        if (creep.store[RESOURCE_ENERGY] == maxCarry) {
            if (creep.memory.status != types_1.Status.Upgrading) {
                creep.memory.status = types_1.Status.Upgrading;
                creep.say("Upgrading");
            }
        }
        const status = creep.memory.status;
        if (status == types_1.Status.Upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else if (status == types_1.Status.Harvesting) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    },
    handleUpgraders: () => {
        spawnCreep(Game.spawns["Spawn1"], (0, types_1.accumulatedCreepType)(phase, upgraderTypes));
    },
};
module.exports = roleUpgrader;
