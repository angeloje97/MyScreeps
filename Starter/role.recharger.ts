import { getNonFullTargets, spawnCreep } from "./general";
import { CreepType, Role, Status } from "./types";

const variableCount = (spawn: StructureSpawn): number => {
    return spawn.memory.hasStorage ? 1 : 0;
};

const rechargerTypes: CreepType[] = [
    {
            phase: 4,
            count: 0,
            substitution: 2,
            body: [
                ...Array(16).fill(CARRY),
                ...Array(10).fill(MOVE)
            ],
            memory: { 
                role: Role.Recharger
            },
    
            forAll: true,
    
            variableCount,
        }
]

const roleRecharger = {
    run: (creep: Creep) => {

        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.status = Status.Harvesting;
        }

        if(creep.store.getFreeCapacity() == 0){
            creep.memory.status = Status.Hauling;
        }


        if(creep.memory.status == Status.Harvesting){
            const storage = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_STORAGE
            })

            if(creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(storage[0])
            }
            return;
        }

        if(creep.memory.status == Status.Hauling){

            const nonFullTargets = getNonFullTargets(creep)
    
            const closestSite = creep.pos.findClosestByRange(nonFullTargets);
            
            if(closestSite){
                if(creep.transfer(closestSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestSite);
                }
            }
        }

    },
    handleRechargers: (spawn: StructureSpawn) => {
        spawnCreep(spawn, rechargerTypes)
    }
}

module.exports = roleRecharger;