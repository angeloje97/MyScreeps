"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep } = require("./spawnerHelper");
const phase = 1;
const builderTypes = [
    {
        phase: 1,
        count: 3,
        body: [CARRY, WORK, MOVE],
        name: "Builder",
        memory: {
            role: "builder",
            status: types_1.Status.Harvesting,
        },
    },
];
const roleBuilder = {
    run: (creep) => {
        if (creep.memory.status == types_1.Status.Building &&
            creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = types_1.Status.Harvesting;
        }
        if (creep.memory.status == types_1.Status.Harvesting &&
            creep.store.getFreeCapacity() == 0) {
            creep.memory.status = types_1.Status.Building;
        }
        if (creep.memory.status == types_1.Status.Building) {
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                }
            }
        }
        if (creep.memory.status == types_1.Status.Harvesting) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    },
    handleBuilders: () => {
        spawnCreep(Game.spawns["Spawn1"], (0, types_1.accumulatedCreepType)(phase, builderTypes));
    },
};
module.exports = roleBuilder;
