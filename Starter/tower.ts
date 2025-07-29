const tower = {
    run: (spawn: StructureSpawn) => {
        const towers = spawn.room.find(FIND_STRUCTURES, {
            filter: s=> s.structureType == STRUCTURE_TOWER
        })

        for(const tower of towers){
            //Attack nearest hostile
            const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if(hostile) {
                tower.attack(hostile);
                return;
            }

            const damagedCreep = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: c => c.hits < c.hitsMax
            })

            if(damagedCreep){
                tower.heal(damagedCreep);
                return;
            }

            const damagedStructure =  tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            })

            if(damagedStructure){
                tower.repair(damagedStructure)
            }
        }
    },
    handleTowers: (spawn:StructureSpawn) => {
        spawn.room.createConstructionSite(spawn.pos.x + 3, spawn.pos.y, STRUCTURE_TOWER)
        spawn.room.createConstructionSite(spawn.pos.x - 3, spawn.pos.y, STRUCTURE_TOWER)

    }
}

module.exports = tower;