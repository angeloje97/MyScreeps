import { CreepType, Role, Status } from "./types";
import _ from "lodash";
import { spawnCreep, getNonFullTargets } from "./general"

const haulerTypes: CreepType[] = [
    {
        phase: 2,
        count: 1,
        body: [
            ...Array(6).fill(CARRY),
            ...Array(5).fill(MOVE)
        ],
        memory: {
            role: Role.Hauler,
            status: Status.Harvesting,
        },
    },
    {
        phase: 3,
        count: 1,
        substitution: 2,
        body: [
            ...Array(10).fill(CARRY),
            ...Array(6).fill(MOVE)
        ],
        memory: { 
            role: Role.Hauler,
            status: Status.Harvesting,
        },
    },
    {
        phase: 4,
        count: 1,
        substitution: 2,
        body: [
            ...Array(16).fill(CARRY),
            ...Array(10).fill(MOVE)
        ],
        memory: { 
            role: Role.Hauler,
            status: Status.Harvesting,
        },
    }
]

const roleHauler = {
    run: (creep: Creep) => {
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.status = Status.Harvesting;
        }

        if(creep.store.getFreeCapacity() == 0){
            creep.memory.status = Status.Hauling;
        }

        if(creep.memory.status == Status.Harvesting){
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()*2
            })

            const closestEnergy = creep.pos.findClosestByRange(droppedEnergy)
            if(closestEnergy){
                if(creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestEnergy)
            }

            }
        }

        if(creep.memory.status == Status.Hauling){
            const nonFullTargets: AnyStructure[] = getNonFullTargets(creep)
            const closestSite = creep.pos.findClosestByRange(nonFullTargets);
            if(closestSite){
                
                if(creep.transfer(closestSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestSite)
                }
            }
            else{
                creep.memory.status = Status.Helping;
            }
        }

        if(creep.memory.status == Status.Helping){
            const otherCreeps = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    if(c.memory.role != Role.Upgrader) return false;
                    const moreThanHalf = c.store.getFreeCapacity() <= c.store.getCapacity() / 2;
                    if(moreThanHalf) return false;

                    return true;
                }
            })

            const closestCreep = creep.pos.findClosestByRange(otherCreeps)
            if(closestCreep){
                if (creep.transfer(closestCreep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestCreep)
                } 
            }
            else{
                creep.memory.status = Status.Harvesting;
            }
        }
    },

    handleHaulers: (spawn: StructureSpawn) => {
        spawnCreep(spawn, haulerTypes)
    }
}

module.exports = roleHauler;