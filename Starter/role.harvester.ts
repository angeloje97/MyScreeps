import _ from "lodash";
import { CreepType, accumulatedCreepType } from "./types";

const { spawnCreep } = require("spawnerHelper");

const phase = 1;

//#region Creep Type Phases
const harvesterTypes: CreepType[] = [
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
  run: (creep: Creep) => {
    var sources = creep.room.find(FIND_SOURCES);

    if (creep.store.getFreeCapacity() > 0) {
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    } else {
      if (
        creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(Game.spawns["Spawn1"]);
      }
    }
  },
  //#endregion

  //#region Automating Spawn
  handleHarvesters: () => {
    spawnCreep(
      Game.spawns["Spawn1"],
      accumulatedCreepType(phase, harvesterTypes)
    );
  },
  //#endregion
};

module.exports = roleHarvester;
