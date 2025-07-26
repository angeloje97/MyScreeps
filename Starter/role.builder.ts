import { accumulatedCreepType, CreepType, Status } from "./types";

const { spawnCreep } = require("./spawnerHelper");

const phase = 1;

const builderTypes: CreepType[] = [
  {
    phase: 1,
    count: 3,
    body: [CARRY, WORK, MOVE],
    name: "Builder",
    memory: {
      role: "builder",
      status: Status.Harvesting,
    },
  },
];

const roleBuilder = {
  run: (creep: Creep): void => {
    if (
      creep.memory.status == Status.Building &&
      creep.store[RESOURCE_ENERGY] == 0
    ) {
      creep.memory.status = Status.Harvesting;
    }

    if (
      creep.memory.status == Status.Harvesting &&
      creep.store.getFreeCapacity() == 0
    ) {
      creep.memory.status = Status.Building;
    }

    if (creep.memory.status == Status.Building) {
      const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (constructionSites.length > 0) {
        if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSites[0]);
        }
      }
    }

    if (creep.memory.status == Status.Harvesting) {
      const sources = creep.room.find(FIND_SOURCES);

      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1]);
      }
    }
  },
  handleBuilders: (): void => {
    spawnCreep(
      Game.spawns["Spawn1"],
      accumulatedCreepType(phase, builderTypes)
    );
  },
};

module.exports = roleBuilder;
