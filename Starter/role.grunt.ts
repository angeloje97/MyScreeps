import { spawn } from "child_process";
import { accumulatedCreepType, CreepType, Role, Status } from "./types";
import { spawnCreep, getNonFullTargets } from "./general"


const gruntTypes: CreepType[] = [
    {
        phase: 1,
        count: 4,
        body: [
            ...Array(1).fill(WORK),
            ...Array(1).fill(CARRY),
            ...Array(1).fill(MOVE)
        ],
        memory: {
            role: Role.Grunt,
        }
    },
    {
        phase: 2,
        count: 4,
        substitution: 1,
        body: [
            ...Array(3).fill(WORK),
            ...Array(2).fill(CARRY),
            ...Array(3).fill(MOVE)
        ],
        memory: {
            role: Role.Grunt,
        }
    },
    {
        phase: 3,
        count: 3,
        substitution: 2,
        body: [
            ...Array(4).fill(WORK),
            ...Array(4).fill(CARRY),
            ...Array(4).fill(MOVE)
        ],
        memory: {
            role: Role.Grunt,
        }
    },

    {
        phase: 4,
        count: 2,
        substitution: 2,
        body: [
            ...Array(6).fill(WORK),
            ...Array(6).fill(CARRY),
            ...Array(8).fill(MOVE)
        ],
        memory: {
            role: Role.Grunt,
        }
    }
]


const roleGrunt = {
    run: (creep: Creep) : void => {
        const isEmpty = creep.store[RESOURCE_ENERGY] == 0
        const isFull = creep.store.getFreeCapacity() == 0

        const nonFullTowers = getNonFullTargets(creep);
        const sources = creep.room.find(FIND_SOURCES)
        const controller = creep.room.controller;

        const {index} = creep.memory

        if(isEmpty){
            creep.memory.status = Status.Harvesting;
        }        
        else if (isFull){
            creep.memory.status = Status.Hauling;
        }

        //#region Harvesting
        if(creep.memory.status == Status.Harvesting){
            let sourceIndex = 0;
            if(index){
                sourceIndex = index % sources.length;
            }
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()*3
            })


            if(droppedEnergy.length == 0){

                if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[sourceIndex])
                }
            }else{
                const closestEnergy = creep.pos.findClosestByRange(droppedEnergy)
                if(closestEnergy){
                    if(creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE){
                        creep.moveTo(closestEnergy)
                    }
                }
            }

        }
        //#endregion

        //#region Hauling
        if(creep.memory.status == Status.Hauling){
            const haulers = creep.room.find(FIND_MY_CREEPS, 
                {
                    filter: c => c.memory.role == Role.Hauler
                }
            )

            if(nonFullTowers.length > 0 && haulers.length == 0){
                if(creep.transfer(nonFullTowers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(nonFullTowers[0])
                }
            }else{
                creep.memory.status = Status.Building;
            }
        }

        //#endregion

        // #region Building
        if(creep.memory.status == Status.Building){
            const prioritySites: BuildableStructureConstant[] = [STRUCTURE_EXTENSION, STRUCTURE_ROAD]
            const sites: ConstructionSite[] = [];

            for(const prio of prioritySites){
                const prioSite = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (site: ConstructionSite) => site.structureType == prio
                })
                const closest = creep.pos.findClosestByRange(prioSite);

                if(closest){
                    sites.push(closest)
                }
            }

            const other = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (s: ConstructionSite) => !prioritySites.includes(s.structureType),
            })
            
            const closestOther = creep.pos.findClosestByPath(other);

            if(closestOther){
                sites.push(closestOther)
            }

            if(sites.length > 0){
                const closesSite = sites[0]

                if (closesSite) {
                    if (creep.build(closesSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closesSite);
                    }
                }
            }else{
                creep.memory.status = Status.Upgrading;
            }
        }
        //#endregion

        //#region Upgrading

        if(creep.memory.status == Status.Upgrading){
            if(controller){
                if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(controller);
                }
            }
        }
        
        //#endregion
    },

    handleGrunt: (spawn: StructureSpawn) => {
        spawnCreep(spawn, gruntTypes);
    }
}

module.exports = roleGrunt