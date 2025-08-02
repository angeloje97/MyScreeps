"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Role = exports.Status = exports.accumulatedCreepType = void 0;
const accumulatedCreepType = (phase, creepList) => {
    for (const creepType of creepList) {
        if (creepType.phase == phase) {
            return creepType;
        }
        if (creepType.forAll && phase > creepType.phase) {
            return creepType;
        }
    }
    return null;
};
exports.accumulatedCreepType = accumulatedCreepType;
//#endregion
//#region Enums
var Status;
(function (Status) {
    Status[Status["None"] = 0] = "None";
    Status[Status["Harvesting"] = 1] = "Harvesting";
    Status[Status["Upgrading"] = 2] = "Upgrading";
    Status[Status["Building"] = 3] = "Building";
    Status[Status["Hauling"] = 4] = "Hauling";
    Status[Status["Helping"] = 5] = "Helping";
    Status[Status["Storing"] = 6] = "Storing";
})(Status || (exports.Status = Status = {}));
var Role;
(function (Role) {
    Role[Role["Grunt"] = 0] = "Grunt";
    Role[Role["Hauler"] = 1] = "Hauler";
    Role[Role["Miner"] = 2] = "Miner";
    Role[Role["Upgrader"] = 3] = "Upgrader";
    Role[Role["Knight"] = 4] = "Knight";
    Role[Role["Archer"] = 5] = "Archer";
    Role[Role["Scout"] = 6] = "Scout";
})(Role || (exports.Role = Role = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Top"] = 0] = "Top";
    Direction[Direction["Bottom"] = 1] = "Bottom";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (exports.Direction = Direction = {}));
//#endregion
