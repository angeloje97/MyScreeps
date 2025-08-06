import { spawn } from "child_process";
import { accumulatedCreepType, CreepType, Role, Status } from "./types";
import { spawnCreep, getNonFullTargets, creepsExists, BodyParts } from "./general"


const gruntTypes: CreepType[] = [
    {
        phase: 1,
        count: 4,
        body: BodyParts([
            {part: WORK, amount: 1},
            {part: CARRY, amount: 1},
            {part: MOVE, amount: 1},
        ]),
        memory: {
            role: Role.Grunt,
        }
    },
    {
        phase: 2,
        count: 4,
        substitution: 1,
        body: BodyParts([
            {part: WORK, amount: 3},
            {part: CARRY, amount: 2},
            {part: MOVE, amount: 3},
        ]),
        memory: {
            role: Role.Grunt,
        }
    },
    {
        phase: 3,
        count: 3,
        substitution: 2,
        body: BodyParts([
            {part: WORK, amount: 4},
            {part: CARRY, amount: 4},
            {part: MOVE, amount: 4},
        ]),
        memory: {
            role: Role.Grunt,
        }
    },

    {
        phase: 4,
        count: 1,
        substitution: 2,
        body: BodyParts([
            {part: WORK, amount: 6},
            {part: CARRY, amount: 6},
            {part: MOVE, amount: 8},
        ]),
        memory: {
            role: Role.Grunt,
        },
        forAll: true,
    }
]


export const roleGrunt = {
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
            let dropIndex = 0;

            const storage = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_STORAGE
            })

            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= creep.store.getFreeCapacity()
            })

            if(index){
                sourceIndex = index % sources.length;
                dropIndex = index % droppedEnergy.length;
            }

            if(
                storage.length > 0 && 
                storage[0].store[RESOURCE_ENERGY] >= creep.store.getCapacity() && 
                storage[0].store[RESOURCE_ENERGY] > Game.spawns[creep.memory.spawn!].memory.minStorageAmount
            ){
                
                if(creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(storage[0])
                }
            }

            else if(droppedEnergy.length == 0){

                if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[sourceIndex])
                }
            }else if(droppedEnergy.length > 0){
                
                if(creep.pickup(droppedEnergy[dropIndex]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(droppedEnergy[dropIndex])
                    
                }
            }

        }
        //#endregion

        //#region Hauling
        if(creep.memory.status == Status.Hauling){
            const haulerExists = creepsExists(Game.spawns[creep.memory.spawn!], [Role.Hauler])

            if(nonFullTowers.length > 0 && !haulerExists){
                const closestTower = creep.pos.findClosestByRange(nonFullTowers);
                if(creep.transfer(closestTower!, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestTower!)
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