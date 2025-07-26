import _ from "lodash";
import { accumulatedCreepType, CreepType, Status } from "./types";
const { spawnCreep } = require("spawnerHelper");

const phase = 1;

const upgraderTypes: CreepType[] = [
  {
    phase: 1,
    count: 2,
    body: [WORK, CARRY, MOVE],
    name: "Upgrader" + Game.time,
    memory: {
      role: "upgrader",
      status: Status.Harvesting,
    },
  },
];

const roleUpgrader = {
  run: (creep: Creep): void => {
    const maxCarry =
      creep.body.filter((part) => part.type === CARRY).length * 50;

    if (creep.store[RESOURCE_ENERGY] == 0) {
      if (creep.memory.status != Status.Harvesting)
        creep.memory.status = Status.Harvesting;
      creep.say("Harvesting");
    }
    if (creep.store[RESOURCE_ENERGY] == maxCarry) {
      if (creep.memory.status != Status.Upgrading) {
        creep.memory.status = Status.Upgrading;
        creep.say("Upgrading");
      }
    }

    const status = creep.memory.status;

    if (status == Status.Upgrading) {
      if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller!);
      }
    } else if (status == Status.Harvesting) {
      const sources = creep.room.find(FIND_SOURCES);

      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1]);
      }
    }
  },

  handleUpgraders: (): void => {
    spawnCreep(
      Game.spawns["Spawn1"],
      accumulatedCreepType(phase, upgraderTypes)
    );
  },
};

module.exports = roleUpgrader;
