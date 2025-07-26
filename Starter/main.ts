import { CreepType } from "./types";
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("./role.builder");
const structureHandler = require("structures");

export function loop(): void {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  structureHandler.run();

  roleUpgrader.handleUpgraders();
  roleBuilder.handleBuilders();
  roleHarvester.handleHarvesters();

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }

    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }

    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }
}
