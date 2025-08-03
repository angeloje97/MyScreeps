"use strict";
const tower = {
    run: (spawn) => {
        const towers = spawn.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_TOWER
        });
        for (const tower of towers) {
            //Attack nearest hostile
            const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostile) {
                tower.attack(hostile);
                continue;
            }
            const damagedCreep = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax
            });
            if (damagedCreep) {
                tower.heal(damagedCreep);
                continue;
            }
            const damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    if (s.hits >= s.hitsMax)
                        return false;
                    if (s.structureType == STRUCTURE_RAMPART && s.hits > 3000)
                        return false;
                    if (s.structureType == STRUCTURE_WALL && s.hits > 3000)
                        return false;
                    return true;
                }
            });
            if (damagedStructure) {
                tower.repair(damagedStructure);
            }
        }
    },
    handleTowers: (spawn) => {
        spawn.room.createConstructionSite(spawn.pos.x + 3, spawn.pos.y, STRUCTURE_TOWER);
        spawn.room.createConstructionSite(spawn.pos.x - 3, spawn.pos.y, STRUCTURE_TOWER);
    }
};
module.exports = tower;
