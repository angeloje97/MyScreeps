import { CreepType } from "./types";
import _ from "lodash";

module.exports = {
  spawnCreep: (spawn: StructureSpawn, creepType: CreepType): void => {
    const { count, body, name, memory } = creepType;

    const currentCreeps = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == memory.role
    );

    if (currentCreeps.length >= count) return;

    spawn.spawnCreep(body, name, { memory: memory });
  },
};
