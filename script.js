const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true);
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

        BABYLON.SceneLoader.ImportMesh("", "", 
        "Assets/Exports/Bag.glb", scene, 
        // function(newMeshes) {
        //     mesh.createInstance("blueBag0");
        //     mesh.createInstance("blueBag1");
        //     mesh.createInstance("blueBag2");
        //     mesh.createInstance("redBag0");
        //     mesh.createInstance("redBag1");
        //     mesh.createInstance("redBag2");
        // }
        );

        // bag 
        // using box as test
        // let bag = BABYLON.MeshBuilder.CreateBox("bag", 
        //     {height: 2, width: 2, depth: 2}, scene);
        // let bagMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        // bagMaterial.diffuseColor = new BABYLON.Color3(95, 82, 25);
        // bag.material = bagMa4terial;

        // create skylight
        let light = new BABYLON.HemisphericLight("sunLight", 
        new BABYLON.Vector3(0, 1, 0), scene);
    
        // create camera, but only set position and not what it's pointing to, because 
        // set that later after board can be referenced
        let camera = new BABYLON.FreeCamera("camera", 
            new BABYLON.Vector3(-23, 5, 0), scene);
        camera.fov = 0.7;

        scene.onPointerDown = function(e) {
            if(!inThrow && event.button == 0) {
                let canvasRef = document.getElementById("canvas");
                let bounds = canvasRef.getBoundingClientRect();
                let lastMousex = e.pageX - bounds.left - scrollX;
                let lastMousey = e.pageY - bounds.top - scrollY;

                lastMousex /= bounds.width; 
                lastMousey /= bounds.height;

                lastMousex *= canvasRef.width;
                lastMousey *= canvasRef.height;
                mouse.startx = lastMousex;
                mouse.starty = lastMousey;
        
                inThrow = true;
            }
        }
        scene.onPointerUp = function(e) {
            if(inThrow && event.button == 0) {
                let canvasRef = document.getElementById("canvas");
                let bounds = canvasRef.getBoundingClientRect();
                let lastMousex = e.pageX - bounds.left - scrollX;
                let lastMousey = e.pageY - bounds.top - scrollY;

                lastMousex /= bounds.width; 
                lastMousey /= bounds.height;

                lastMousex *= canvasRef.width;
                lastMousey *= canvasRef.height;
                mouse.endx = lastMousex;
                mouse.endy = lastMousey;

                // actual throw
                throwData.x = mouse.endx - mouse.startx;
                throwData.y = mouse.endy - mouse.starty;
                throwData.speed = (throwFrames < throwData.maxFrames) ? 
                    Math.ceil((throwData.maxFrames - throwFrames) / 15) : 
                    throwData.maxFrames;

                inThrow = false;
                throwFrames = 0;
            }
        }
        
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
    engine.runRenderLoop(function() {
        scene.getMeshByName("Bag").position.y += 0.01;
        throwStuff();
        scene.render();
    });    
}

let inThrow = false;
// number of frame elapsed during throw to determine power/speed
let throwFrames = 0;
let mouse = {
    // position of start of throw
    startx: null,
    starty: null,
    // position of end of throw
    endx: null,
    endy: null
};
let throwData = {
    speed: null, 
    // how much on the x axis throw will travel
    x: null, 
    // how much on the y axis throw will travel
    y: null, 
    // the max values to have frames subtracted from to figure out speed
    maxFrames: 150
}

function throwStuff() {
    if(inThrow) {
        ++throwFrames;
    }
}