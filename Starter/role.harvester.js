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
            if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) ==
                ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns["Spawn1"]);
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
