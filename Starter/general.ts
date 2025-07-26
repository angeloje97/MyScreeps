type BaseProps = {
    phase: number
}

const baseProps: BaseProps = {
    phase: 1,
}

const upgradePhase = () => {
    baseProps.phase += 1;
}

const currentBaseProps = () => {
    return {... baseProps}
}

module.exports = {
    upgradePhase,
    currentBaseProps
}