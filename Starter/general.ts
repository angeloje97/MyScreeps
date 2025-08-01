import { accumulatedCreepType, CreepType, Role } from "./types";
import _, { max, memoize } from "lodash";

export const getNonFullTargets = (creep: Creep, additionalStructures: StructureConstant[] = []) => {

    const targets = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, ...additionalStructures];
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            let isTarget = true;
            for (const target of targets) {
                if (structure.structureType == target) {
                    if ('store' in structure && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
    });
};


//#region Inventory Functions

export const hasAllExtensionsBuilt = (spawn: StructureSpawn, phase: number | null = null): boolean => {
    const EXTENSIONS_PER_LEVEL = [0, 0, 5, 10, 20, 30, 40, 50, 60]; // index = controller level
    const room = spawn.room;

    if(phase == null){
      phase = room.controller?.level ?? 0;
    }

    const builtExtensions = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    }).length;

    const maxExtensions = EXTENSIONS_PER_LEVEL[phase];

    return builtExtensions >= maxExtensions;
}

export const allExtensionsFull = (spawn: StructureSpawn): boolean => {
    const extensions = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    });
    
    const spawnFull = spawn.store.getFreeCapacity(RESOURCE_ENERGY) == 0;
    if(!spawnFull) return false;

    const extensionsFull= extensions.every(ext => ext.store.getFreeCapacity(RESOURCE_ENERGY) === 0);

    return extensionsFull;
};

//#endregion

//#region Creep Functions
export const creepsExists = (spawn: StructureSpawn, roles: Role[]) => {
  const foundRoles: Role[] = []
  
  const creeps = spawn.room.find(FIND_MY_CREEPS)

  for(const creep of creeps){
    if(!foundRoles.includes(creep.memory.role)){
      foundRoles.push(creep.memory.role)
    }
  }

  for(const role of roles){
    if(!foundRoles.includes(role)){
      return false;
    }
  }

  return true;
}
//#endregion

//#region Spawn Creep

let useSub = false;
let subPhase = 0;
let replaceMentTicks = 10;
const maxReplacementTicks = 40;

export const spawnCreep = (spawn: StructureSpawn, creepTypes: CreepType[]): void => {

  //#region Common Data
  
  let phase = spawn.room.controller!.level;
  
  if(useSub){
    phase = subPhase;
  }

  if(spawn.memory.replacingCoolDown > 0){
    spawn.memory.replacingCoolDown -= 1;
  }
  
  const creepType = accumulatedCreepType(phase, creepTypes)
  
  if(creepType == null) return;
  const { body, memory, substitution, phase: creepPhase } = creepType;
  
  const count = creepType.variableCount ? creepType.variableCount(spawn) : creepType.count;

  const name = Role[memory.role]
  
  const currentCreeps = _.filter(
    Game.creeps,
    (creep) =>  
        creep.memory.role === memory.role &&  
        creep.memory.spawn === spawn.name &&
        typeof creep.ticksToLive == 'number' &&
        creep.ticksToLive > (body.length * 3) + 10
  );

  //#endregion


  //#region Handle Replacing Creep With Substitution
  if (currentCreeps.length >= count){
    let suicide = false;
    const hasExtensions = hasAllExtensionsBuilt(spawn, creepPhase);
    for(const creep of currentCreeps){
      if(creep.memory.phase! < phase){
        const fullResources = allExtensionsFull(spawn);

        if(hasExtensions && fullResources){
          creep.suicide();
          suicide = true;
          spawn.memory.replacingCoolDown = maxReplacementTicks;
          break;
        }
      }
    }

    if(! suicide){
      const hasCreeps = creepsExists(spawn, [Role.Hauler, Role.Miner]);
      if(substitution && (!hasCreeps || !hasExtensions)){
        subPhase = substitution;
        useSub = true;

        spawnCreep(spawn, creepTypes)

        useSub = false;
      }
    }
    return;

  }
  //#endregion

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
  
  //#region Spawning Creep

  let result = spawn.spawnCreep(body, name + Game.time, {
    memory: { ...memory, spawn: spawn.name, index, phase },
  })

  //#endregion

  //#region Handle Substitution
  if(result == ERR_NOT_ENOUGH_ENERGY && substitution){

    const hasCreeps = creepsExists(spawn, [Role.Hauler, Role.Miner])
    const hasExtensions = hasAllExtensionsBuilt(spawn, creepPhase);
    if(hasCreeps && hasExtensions) return;

    

    subPhase = substitution;

    useSub = true;

    spawnCreep(spawn, creepTypes)

    useSub = false;
    subPhase = 0;
  }
  //#endregion
};
//#endregion
