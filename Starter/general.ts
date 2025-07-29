import { accumulatedCreepType, CreepType, Role } from "./types";
import _ from "lodash";

const getNonFullTargets = (creep: Creep) => {
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


//#region Spawn Creep

let useSub = false;
let subPhase = 0;
const spawnCreep = (spawn: StructureSpawn, creepTypes: CreepType[]): void => {

  if(spawn.spawning){
    return;
  }

  let phase = spawn.room.controller!.level;

  if(useSub){
    phase = subPhase;
  }

  const creepType = accumulatedCreepType(phase, creepTypes)

  if(creepType == null) return;
  const { count, body, memory, substitution } = creepType;

  const name = Role[memory.role]

  const currentCreeps = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == memory.role && creep.memory.spawn == spawn.name
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
  let result = spawn.spawnCreep(body, name + Game.time, {
      memory: { ...memory, spawn: spawn.name, index, phase },
    })

  if(result == ERR_NOT_ENOUGH_ENERGY && substitution){
    subPhase = substitution;

    useSub = true;

    spawnCreep(spawn, creepTypes)

    useSub = false;
  }
};
//#endregion


module.exports = {
  spawnCreep,
  getNonFullTargets,
};
