declare global {
  interface CreepMemory {
    role: string;
    index?: number;
    status?: Status;
    spawn?: string;
  }
}

//#region Creep Type
export type CreepType = {
  body: BodyPartConstant[];
  name: string;
  count: number;
  phase: number;
  memory: CreepMemory;

  
  substitution?: number;

};

export const accumulatedCreepType = (
  phase: number,
  creepList: CreepType[]
): CreepType | null => {


  for(const creepType of creepList){
    if(creepType.phase == phase){
      return creepType;
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
}

//#endregion
