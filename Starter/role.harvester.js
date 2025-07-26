"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const { spawnCreep } = require("spawnerHelper");
const phase = 1;
//#region Creep Type Phases
const harvesterTypes = [
    {
        phase: 1,
        count: 3,
        body: [WORK, MOVE, CARRY],
        name: "Harvester",
        memory: {
            role: "harvester",
        },
    },
];
//#endregion
const moveOptions = {
    visualizePathStyle: { stroke: "#ffffff" },
};
const getNonFullTargets = (creep) => {
    const targets = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            let isTarget = true;
            for (const target of targets) {
                if (structure.structureType == target) {
                    if (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
    });
};
const roleHarvester = {
    //#region Automation
    run: (creep) => {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            const targets = getNonFullTargets(creep);
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], moveOptions);
                }
            }
        }
    },
    //#endregion
    //#region Automating Spawn
    handleHarvesters: () => {
        spawnCreep(Game.spawns["Spawn1"], (0, types_1.accumulatedCreepType)(phase, harvesterTypes));
    },
    //#endregion
};
module.exports = roleHarvester;
