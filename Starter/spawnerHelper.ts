import { CreepType } from "./types";
import _ from "lodash";

const spawnCreep = (spawn: StructureSpawn, creepType: CreepType): void => {
  const { count, body, name, memory } = creepType;

  const currentCreeps = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == memory.role
  );

  if (currentCreeps.length >= count) return;


  //#region Determining the Index
  let index = 0

  while(index < currentCreeps.length){
    let alreadyExists = false;
    for(const creep of currentCreeps){
      if(creep.memory.index == index){
        alreadyExists = true;
        break;
      }
    }

    if(!alreadyExists){
      break;
    }

    index++;
  }

  //#endregion

  spawn.spawnCreep(body, name + Game.time, {
    memory: { ...memory, spawn: spawn.name, index  },
  });
};


module.exports = {
  spawnCreep
};
