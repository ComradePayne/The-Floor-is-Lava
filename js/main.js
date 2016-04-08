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
    
    var game = new Phaser.Game( 288, 352, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
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
        game.load.image('stairs', 'assets/sprites/stairs_32x32.png');
        //Load music an' such.
        
        
    }
    
    //Player variable
    var dwarf;
    //Player Speed
    var DWARF_SPEED = 60;
    
    //Map variable
    var cavernMap;
    
    //Layer/object variables
    var coolFloorLayer;//Tile
    var warmFloorLayer;//Tile
    var lavaLayer;//Tile
    var wallLayer;//Tile
    var jewelGroup;   //Object
    var stairsGroup; //Object
    
    //Cursors variable.
    var cursors;
    
    //Constants for the lava duration and the lava period.
    //The lava period is the time between consecutive floods of lava.
    //The lava duration is the amount of time a single flood of lava lasts.
    
    //Lava Flooding Time Diagram
    
    
    //   No lava.    Lava!  No lava.
    //  <__________> <==> <__________>
    //     10s       2s      10s
    
    
    //Units are in milliseconds.
    var lavaDuration = 2000;    //2 seconds
    var lavaPeriod = 10000; //10 seconds
    //Number of jewels on the map
    var numJewels;
    //Number of jewels the dwarf has collected.
    var numCollected;
    
    
    function create() {
    //WORLD STUFF BELOW!
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
        
            //Collision for wall layer.
        
            cavernMap.setCollisionBetween(1,100,true, wallLayer);
        
        //Establish objects.
        jewelGroup = game.add.group();
        stairsGroup = game.add.group();
        
        cavernMap.createFromObjects('Jewels', 3, 'jewel',0, true, false, jewelGroup);
        cavernMap.createFromObjects('Stairs', 6, 'stairs',0, true, false, stairsGroup);
        
    //DWARF STUFF BELOW!
        //Establish the dwarf (the player) at the center of the bottom platform (See the Tiled map).
        dwarf = game.add.sprite( 140 , 350, 'dwarf');
        
        //Dwarf Animations.
        //ANIMATIONS! Just one, actually.
        dwarf.animations.add('run', [1,2,3], 3, true);
        
        //Enable the dwarf's body. Resize it so it can fit into the crevices!
        game.physics.arcade.enableBody(dwarf);
        
        dwarf.body.setSize(22,15,0,0);
        
        //Set anchors so that rotation works properly.
        dwarf.anchor.x = 0.5;
        dwarf.anchor.y = 0.5;
        
        //Get them keys setup.
        cursors = game.input.keyboard.createCursorKeys();
        
    //GAME LOGIC: 
        
        //Jewel & Stairs Logic:
        
            //Initialize jewel count, jewel and stair bodies.
            numJewels = jewelGroup.length;
            jewelGroup.enableBody = true;
            stairsGroup.enableBody = true;
        
        //Lava Logic Setup:
            //The lava collides with the dwarf.
            cavernMap.setCollisionBetween(1,100, true, lavaLayer);
            //What should the game do when the dwarf collides with the lava?
            cavernMap.setTileIndexCallback(5, fieryDeath, this, lavaLayer);

        //Timer Setup; create the two timers, set the lava period timer.
        game.time.events.add(0, lavaRecede, this, lavaLayer);
        
            
    }
    
    function update() {
        
        //The dwarf and the walls must collide!
        game.physics.arcade.collide(dwarf,wallLayer);
        //As must the dwarf and the lavaLayer!
        game.physics.arcade.collide(dwarf, lavaLayer);
        
        game.physics.arcade.overlap(dwarf, jewelGroup, collectJewel, null, this);
        
        // Listen for keyboard input and move dwarf character.
        playerControl();
        
    }
    
   
    
    function lavaFlood(lavaLayer){
        lavaLayer.visible = true;
        //After we make the lava visible, we set a delay for calling lavaRecede after the lava duration has passed. 
        game.time.events.add(lavaDuration, lavaRecede, this, lavaLayer );
        
        
    }
    
    function lavaRecede(lavaLayer){
        lavaLayer.visible = false;
        //After the lava is dispelled, call lavaFlood() after the lava period has passed.
        game.time.events.add(lavaPeriod, lavaFlood, this, lavaLayer );
        
        
    }
    
    function nextLevel(dwarf, numJewels, stairsGroup){}
    
    
    //What happens after the dwarf overlaps with a jewel?
    function collectJewel(dwarf, jewel){
        jewel.kill();
        numJewels--;
    }
    //What happens when the dwarf collides with a visible lava tile?
    function fieryDeath(dwarf, lavaLayer){
        
        if(lavaLayer.visible == true){
            dwarf.kill();
            game.add.text(game.world.centerX, game.world.centerY, 'Ya pranced into tha\' lava an\' died. \n Game O\'er, ya nitwit!\n');
        
        }
    }
    //How does the dwarf move about?
    function playerControl(){
        dwarf.body.velocity.x = 0;
        dwarf.body.velocity.y = 0;
        
        
        //Left
        if(cursors.left.isDown){
            dwarf.body.velocity.x = (-1)*DWARF_SPEED;
            dwarf.rotation = 3*(3.14)/2;
            dwarf.animations.play('run');
            
        }
            
            //Right
            
        else if(cursors.right.isDown){
            
            dwarf.body.velocity.x = DWARF_SPEED;
            dwarf.rotation = (3.14)/2;
            dwarf.animations.play('run');
            
        }
            //Up
        
        else if(cursors.up.isDown){
            dwarf.body.velocity.y = (-1)*DWARF_SPEED;
            dwarf.rotation = (0);
            dwarf.animations.play('run');
            
            
        }
            
            //Down
        else if(cursors.down.isDown){
            dwarf.body.velocity.y = DWARF_SPEED;
            dwarf.rotation = 3.14;
            dwarf.animations.play('run');
             
        }
        
        //Idle
        else{
            
            dwarf.animations.stop();
            dwarf.frame = 0;
            
        }
        
        
    }
};
