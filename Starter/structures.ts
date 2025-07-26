const handleExtensions = (): void => {
  const spawn = Game.spawns["Spawn1"];
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

const handleRoads = (): void => {
  const spawn = Game.spawns["Spawn1"];
  const sources = spawn.room.find(FIND_SOURCES);
  const controller = spawn.room.controller;

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
};

const handleTower = (): void => {
  const spawn = Game.spawns['Spawn1']

  spawn.room.createConstructionSite(spawn.pos.x + 3, spawn.pos.y, STRUCTURE_TOWER)
}

const structureHandler = {
  run: () => {
    handleExtensions();
    handleRoads();
    handleTower();
  },
};

module.exports = structureHandler;
