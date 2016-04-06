window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        //Load the tile map
        game.load.tilemap('map', 'assets/sprites/TheFloorIsLava.json',null,Phaser.Tilemap.TILED_JSON );
        //Load sprites
        game.load.spritesheet("dwarf", 'assets/sprites/dwarf_animated_32x32.png',32,32);
        
        game.load.image('mapTiles', 'assets/sprites/tileset_32x32.png');
        
        game.load.image('coolFloor', 'assets/sprites/cool_floor_32x32.png');
        game.load.image('warmFloor', 'assets/sprites/warm_floor_32x32.png');
        game.load.image('wall', 'assets/sprites/wall_32x32.png');
        game.load.image('jewel', 'assets/sprites/yellowJewel_32x32.png');
        game.load.image('lava', 'assets/sprites/lava_32x32.png');
        //Load music an' such.
        
        
    }
    
    //Player variable
    var dwarf;
    //Player Speed
    var DWARF_SPEED = 10;
    
    //Map variable
    var cavernMap;
    
    //Layer/object variables
    var coolFloorLayer;//Tile
    var warmFloorLayer;//Tile
    var lavaLayer;//Tile
    var wallLayer;//Tile
    var jewelLayer;   //Object
    var stairsLayer; //Object
    
    //Stair variable
        
    //Number of jewels on the map
    var numJewels;
    
    function create() {
        
        //Physics!
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //First, link the tilemap with cavernmap.
        cavernMap = game.add.tilemap('map');
        cavernMap.addTilesetImage('tileset_32x32','mapTiles');
        
        //Establish our layers. We go from the bottom up!
        coolFloorLayer = cavernMap.createLayer('CoolFloor');
        warmFloorLayer = cavernMap.createLayer('HotFloor');
        lavaLayer = cavernMap.createLayer('Lava');
        wallLayer = cavernMap.createLayer('Wall Layer');
        
        lavaLayer.visible = false;
        
        
        
    }
    
    function update() {
        
    }
};
