const canvas = document.getElementById("canvas"); // Get the canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.enableOfflineSupport = false;
let scene;
// in milliseconds
const startWait = 100;

function play(gameType) {
    document.getElementById("mainMenu").style.display = "none";

    switch(gameType) {
        case "practice":
            load();
            window.setTimeout(setUp, startWait);
            window.setTimeout(start, startWait);
            break;
        case "local":
            break;
        case "online":
            break;
    }
}

// import stuff
function load() {
    let createScene = function () {
        let scene = new BABYLON.Scene(engine);
        // make background clear
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        // create ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", 
            {width: 40, height: 150}, 
            scene);
        let groundMaterial = new BABYLON.StandardMaterial("goundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.28, 0.78, 0.70);
        ground.material = groundMaterial;
        

        // import board
        BABYLON.SceneLoader.ImportMesh("", "", 
        "Assets/Exports/Board.glb", scene);
        

        // create skylight
        let light = new BABYLON.HemisphericLight("sunLight", 
        new BABYLON.Vector3(0, 1, 0), scene);
    
        // create camera, but only set position and not what it's pointing to, because 
        // set that later after board can be referenced
        let camera = new BABYLON.FreeCamera("camera", 
            new BABYLON.Vector3(-23, 5, 0), scene);
        camera.fov = 0.7;
        
        return scene;
    };
    
    scene = createScene();
}

// position stuff
function setUp() {
    let board = scene.getMeshByName("Board");
    board.position.y = 0;
    // point camera to board
    scene.getCameraByName("camera").setTarget(board.position);
}

// actual game
function start() {
    engine.runRenderLoop(function () {
        scene.render();
    });    
}

window.addEventListener("resize", function () {
    engine.resize();
});