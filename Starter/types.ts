declare global {
  interface CreepMemory {
    role: string;
    status?: Status;
  }
}

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

//#region Enums

export enum Status {
  Harvesting,
  Upgrading,
}

//#endregion
