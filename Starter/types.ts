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
};

export const accumulatedCreepType = (
  phase: number,
  creepList: CreepType[]
): CreepType => {
  return creepList[0];
};
//#endregion

//#region Enums

export enum Status {
  None,
  Harvesting,
  Upgrading,
  Building,
  Hauling,
}

//#endregion
