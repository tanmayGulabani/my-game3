const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var box1, zombie1,zombie3;
var backgroundImg,platform;
var boy, slingshot;

var gameState = "onSling";
var gameState2= "start"
var bg = "sprites/bg1.png";
var score = 0;
var database;
var form;
var flagBox1=0;
var flagBox2=0;
var flagleftSling1=0;
var flagleftSling2=0;
var flagrightSling1=0;
var flagrightSling2=0;
var maxId=0;

function preload() {
    backgroundImg=loadImage(bg)
}

function setup(){
    var canvas = createCanvas(displayWidth,displayHeight);
    engine = Engine.create();
    world = engine.world;


    ground = new Ground(600,height,1200,20);
    platform = new Ground(45, 305, 300, 170);

    level1 = new Ground(Math.round(random(600,900)),Math.round(random(300,700)),300,30)

    box1 = new Box(level1.body.position.x,50,250,100);
    box2 = new Box(level1.body.position.x,150,250,100);
    
    zombie1 = new Zombie(500,level1.body.position.y-200);
   
    leftSling1= new Catapult(270,250,50,150, "sprites/sling1.png")
    leftSling2= new Catapult(240,220,50,80, "sprites/sling2.png")
    

    boy = new Boy(200,50);
    stone = new Boy(200,200);
    stone2 = new Zombie(600,600);
    

    rightSling1= new Catapult(330,40,50,150, "sprites/sling1.png")
    rightSling2= new Catapult(300,220,50,80, "sprites/sling2.png")

    //log6 = new Log(230,180,80, PI/2);
    slingshot = new SlingShot(boy.body,{x:200, y:50});
    database=firebase.database();
    playersRef = database.ref("players");
     playersRef.once("value",(data) => { maxId = data.numChildren() +1; })
    form=new Form();

}

function draw(){
        background(backgroundImg);
        Engine.update(engine);
        if (gameState2==="start"){
            form.display();
        }
        else if(gameState2==="play"){
            form.hide();
            text(mouseX+","+mouseY,mouseX,mouseY)
            noStroke();
            textSize(35)
            fill("white")
            text("Score  " + score, width-300, 50)
            
            box2.display();
            box1.display();
            ground.display();
            Matter.Body.setPosition(zombie1.body,{x:box1.body.position.x,y:box1.body.position.y-50})
            zombie1.display();
            zombie1.score();
            level1.display();
            box1.score();
            box2.score();

            boy.display();
            platform.display();
            slingshot.display(); 

            var collision1=Matter.SAT.collides(boy.body,box1.body)
            if (collision1.collided){
                flagBox1=1
            }
            if (flagBox1){
                score+=10 
                flagBox1=0
            } 
            var collision2=Matter.SAT.collides(boy.body,box2.body)
            if (collision2.collided){
                flagBox2=1
            }
            if (flagBox2){
                score+=10 
                flagBox2=0
            } 
         /*   
            var collision3=Matter.SAT.collides(stone2.body,leftSling1.body)
            if (collision3.collided){
                flagleftSling1=1
            }
            if (flagleftSling1){
                score+=10 
                flagleftSling1=0
            } 
            var collision4=Matter.SAT.collides(stone2.body,leftSling2.body)
            if (collision4.collided){
                flagleftSling2=1
            }
            if (flagleftSling2){
                score+=10 
                flagleftSling2=0
            }
            */ 
            var collision5=Matter.SAT.collides(boy.body,rightSling1.body)
            if (collision5.collided){
                flagrightSling1=1
            }
            if (flagrightSling1){
                score+=10 
                flagrightSling1=0
            } 
            var collision6=Matter.SAT.collides(boy.body,rightSling2.body)
            if (collision6.collided){
                flagrightSling2=1
            }
            if (flagrightSling2){
                score+=10 
                flagrightSling2=0
            } 
        }
   
}

function mouseDragged(){
    if (gameState!=="launched"){
        Matter.Body.setPosition(boy.body, {x: mouseX , y: mouseY});
    }
}


function mouseReleased(){
    slingshot.fly();
    gameState = "launched";
}

function keyPressed(){
    if(keyCode === 32  && boy.body.speed<1){
        boy.trajectory=[];
        gameState="onSling";
        Matter.Body.setPosition(boy.body,{x:200,y:50});
       slingshot.attach(boy.body);
    }
}
