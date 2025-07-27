"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = loop;
const structureHandler = require("structures");
const roleGrunt = require("./role.grunt");
const roleKnight = require("./role.knight");
function loop() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    for (const spawn of Object.values(Game.spawns)) {
        structureHandler.run(spawn);
        roleKnight.handleKnights(spawn);
        roleGrunt.handleGrunt(spawn);
    }
    const runners = {
        grunt: roleGrunt.run,
        knight: roleKnight.run
    };
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (name in runners) {
            runners[name](creep);
        }
    }
}
