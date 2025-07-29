const handleExtensions = (spawn: StructureSpawn): void => {
  const room = spawn.room;
  const maxContainers = 3;

  const struct = STRUCTURE_EXTENSION;
  for (let i = 0; i < maxContainers; i++) {
    const pos = new RoomPosition(spawn.pos.x, spawn.pos.y, room.name);

    room.createConstructionSite(pos.x + i + 1, pos.y + i + 1, struct);
    room.createConstructionSite(pos.x - i - 1, pos.y + i + 1, struct);
    room.createConstructionSite(pos.x + i + 1, pos.y - i - 1, struct);
    room.createConstructionSite(pos.x - i - 1, pos.y - i - 1, struct);
  }
};

const handleRoads = (spawn: StructureSpawn): void => {
  const sources = spawn.room.find(FIND_SOURCES);
  const controller = spawn.room.controller;


  //#region Level 2 Roads
  const handleLevel2 = () => {
    if(controller && controller.level !== 2) return;
    for (const source of sources) {
      const path = spawn.room.findPath(spawn.pos, source.pos, {
        ignoreCreeps: true,
      });
      
      for (let i = 0; i < path.length - 1; i++) {
        const step = path[i]
        spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
      }
    }
    
    if(controller){
      const path = spawn.room.findPath(spawn.pos, controller.pos, {ignoreCreeps : true})
      
      for(let i = 0; i < path.length - 1; i++){
        const step = path[i];
        spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD)
      }
    }
  }
  //#endregion

  //#region Level 3 Roads
  const handleLevel3 = () => {
    if(controller && controller.level !== 3) return;
    const exitTypes = [FIND_EXIT_TOP, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT_RIGHT]

    for(const exitType of exitTypes){
      const exits = spawn.room.find(exitType);
      if(exits.length == 0) continue;


      const path = spawn.room.findPath(spawn.pos, exits[0], { ignoreCreeps: true});

      for(const step of path){
        spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD)
      }
    }
  }
  //#endregion
  // handleLevel2();
  // handleLevel3();
};

const structureHandler = {
  run: (spawn: StructureSpawn) => {
    handleRoads(spawn);
    handleExtensions(spawn);
  },
};

module.exports = structureHandler;
