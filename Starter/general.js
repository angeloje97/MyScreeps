"use strict";
const baseProps = {
    phase: 1,
};
const upgradePhase = () => {
    baseProps.phase += 1;
};
const currentBaseProps = () => {
    return Object.assign({}, baseProps);
};
module.exports = {
    upgradePhase,
    currentBaseProps
};
