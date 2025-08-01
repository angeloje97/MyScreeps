declare global {
  interface CreepMemory {
    role: Role;
    index?: number;
    status?: Status;
    spawn?: string;
    phase?: number;
  }
}

declare global {
  interface SpawnMemory{
    replacingCoolDown: number,
    roadLevelsPlaced: boolean[],
  }
}

//#region Creep Type
export type CreepType = {
  body: BodyPartConstant[];
  count: number;
  phase: number;
  memory: CreepMemory;

  requiredCreeps?: Role[]
  substitution?: number;
  forAll?: boolean;
};

export const accumulatedCreepType = (
  phase: number,
  creepList: CreepType[]
): CreepType | null => {


  for(const creepType of creepList){
    if(creepType.phase == phase){
      return creepType;
    }

    if(creepType.forAll && phase > creepType.phase){
      return creepType
    }
  }

  return null;
};
//#endregion

//#region Enums

export enum Status {
  None,
  Harvesting,
  Upgrading,
  Building,
  Hauling,
  Helping,
  Storing,
}

export enum Role {
  Grunt,
  Hauler,
  Miner,
  Upgrader,
  Knight,
  Archer
}

//#endregion
