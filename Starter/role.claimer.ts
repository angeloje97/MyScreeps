import { BodyParts, spawnCreep } from "./general";
import { CreepType, Role } from "./types";

const variableCount = (spawn: StructureSpawn): number => {
    let myControllers = 0;
    for(const room of spawn.memory.roomsInUse){
        if(!room.controller) continue;
        if(room.controller.my){
            myControllers += 1;
            continue;
        }
        if(myControllers >= Game.gcl.level){
            return 0;
        }
        return 1;
    }
    return 0;
};

const claimerTypes: CreepType[] = [
    {
        phase: 4,
        count: 1,
        body: BodyParts([
            { part: CLAIM, amount: 1},
            { part: MOVE, amount: 2}
        ]),
        memory: {
            role: Role.Claimer,
        },
        variableCount,
        forAll: true,
    }
]

const roleClaimer = {
    run: (creep: Creep) => {
        for(const room of Game.spawns[creep.memory.spawn!].memory.roomsInUse){
            if(!room.controller) continue;
            if(room.controller.my) continue;

            const result = creep.claimController(room.controller);
            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(room.controller);
            }
            return;
        }
    },
    handleClaimers: (spawn: StructureSpawn) => {
        spawnCreep(spawn, claimerTypes)
    }
}

module.exports = roleClaimer;