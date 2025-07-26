import { spawn } from "child_process";
import { accumulatedCreepType, CreepType, Status } from "./types";
const { spawnCreep } = require("spawnerHelper");

const phase = 1;

const gruntTypes: CreepType[] = [
    {
        phase: 1,
        count: 5,
        name: "Grunt",
        body: [WORK, CARRY, MOVE],
        memory: {
            role: "grunt",
        }
    },
    {
        phase: 1,
        count: 4,
        name: "Grunt",
        body: [WORK, WORK, CARRY, CARRY, MOVE],
        memory: {
            role: "grunt",
            status: Status.Harvesting
        }
    }
]

//#region NonFullTowers
const getNonFullTargets = (creep: Creep) => {
    const targets = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            let isTarget = true;
            for (const target of targets) {
                if (structure.structureType == target) {
                    if (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
    });
};
//#endregion

const roleGrunt = {
    run: (creep: Creep) : void => {
        const isEmpty = creep.store[RESOURCE_ENERGY] == 0
        const isFull = creep.store.getFreeCapacity() == 0

        const nonFullTowers = getNonFullTargets(creep);
        const sources = creep.room.find(FIND_SOURCES)
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
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
                console.log(index);
            }
            if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[sourceIndex])
            }
        }
        //#endregion

        //#region Hauling
        if(creep.memory.status == Status.Hauling){
            if(nonFullTowers.length > 0){
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
            if(sites.length > 0){
                if(creep.build(sites[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sites[0])
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

    handleGrunt: () => {
        spawnCreep(Game.spawns['Spawn1'], accumulatedCreepType(phase, gruntTypes));
    }
}

module.exports = roleGrunt