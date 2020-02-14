////this button allows the user to adjust the simulation speed
function generateSimulationSpeedValueButton(x, y, w, h) {
    let valueButton = new ValueButton(x, y, w, h, "Simulation Speed");
    valueButton.getValue = ()=>simulationSpeed;
    valueButton.increaseValue = ()=>simulationSpeed++;
    valueButton.decreaseValue = ()=>simulationSpeed = max(1,simulationSpeed-1);
    return valueButton;
}