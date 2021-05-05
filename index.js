//Global statements And variables
var canvas=document.querySelector("canvas");
var contact=document.getElementById("contact");
var gameOver=document.getElementById("game-over");
var roundWin=document.getElementById("roundWin");
var miss=document.getElementById("miss");
var victory=document.getElementById("victory");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];
var playerWin=false;
var computerWin=false;
function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}
var c=canvas.getContext("2d");
//Adjusts canvas to fit in full size of screen inspite of resizing
addEventListener("resize",()=>{
    canvas.width=window.innerWidth;
canvas.height=window.innerHeight; 
});
//End Of Global Code

//Ball Object
function Ball(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=dy;
    this.radius=radius
    this.draw=function(){
        c.beginPath();
        c.fillStyle="azure";
        c.strokeStyle="azure";
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        c.stroke();
        c.fill();
        c.closePath();
    }
    this.update=function(){
        this.draw();
        this.x+=this.dx;
        this.y+=this.dy;
        //Handles for collision with edges of Court.Not essential Code
        if(this.x+this.dx-this.radius<canvas.width*0.1||this.x+this.radius+this.dx>canvas.width*0.9){
            this.dx=-this.dx
        }
        if(this.y+this.dy-this.radius<canvas.height*0.1||this.y+this.radius+this.dy>canvas.height*0.95){
            this.dy=-this.dy
        }
        
    }
}
//End of Ball Object

//Paddle Object
function Paddle(x,y,dx,dy,length){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=dy;
    this.length=length;
    this.draw=function(){
        c.beginPath();
        c.moveTo(this.x,(this.y)-(this.length/2));
        c.lineTo(this.x,(this.y)+(this.length/2));
        c.strokeStyle="white";
        c.lineWidth=10;
        c.stroke();
        c.closePath();
    }
    this.update=function(){
        this.draw();
        //Prevents Paddle from going out of Court Bounds.By setting y velocity to 0.This is made smoother
        if(((this.y)-(this.length/2)+this.dy<canvas.height*0.1)||((this.y)+(this.length/2)+this.dy>canvas.height*0.95)){
        this.dy=-this.dy*0
        }
        this.y+=this.dy;
    }
}
//Initialising The objects
var ball = new Ball(canvas.width/2,canvas.height/2,5,Math.random()*8,15);
var computerPaddle= new Paddle(canvas.width*0.1+40,canvas.height/2,2,2,(80*(canvas.height/745)));
var playerPaddle = new Paddle(canvas.width*0.9-40,canvas.height/2,2,0,(80*(canvas.height/745)));
//

//Event handler for movement of player Paddle
addEventListener("keydown",function(event){
if(event.key==="ArrowUp"||event.key==="w"){
playerPaddle.dy=-8;
}
if(event.key==="ArrowDown"||event.key==="s"){
playerPaddle.dy=8;
}
});
addEventListener("keyup",function(){
    playerPaddle.dy=0;
})
//
//Variable to keep track of game parameters
var playerScore=0;
var computerScore=0;
var start =true;//variable for checking if ball is in play
var startGame=0;//variable that limits activation of statements in click handler
addEventListener("click",function(){
    startGame+=1;
    //Pauses and rewinds all sounds
    gameOver.pause();
    contact.pause();
    miss.pause();
    roundWin.pause();
    victory.pause();
     gameOver.currentTime=0;
    contact.currentTime=0;
    miss.currentTime=0;
    roundWin.currentTime=0;
    victory.currentTime=0;
    if(startGame===1){
        playerScore=0;
computerScore=0;
        start=true;
        animate();
    }
});
var round=1;//variable that keeps track of the round
function animate(){
    if(start){
    requestAnimationFrame(animate);//Recursion occurs only when play is active or when game is "start"ed
    }
    else{
        //Creates timeGap from Ball going out to next serve
        setTimeout(() => {
            cancelAnimationFrame(animate)//New Paddle and Ball created at their original positions for each play
            computerPaddle= new Paddle(canvas.width*0.1+40,canvas.height/2,2,2,(80*(canvas.height/745)));
             if(playerWin){
                playerScore+=1;
                 ball = new Ball(canvas.width/2,canvas.height/2,-(5+((round-1)/3)*6),Math.random()*8,15);//Ball travels towards computer in a serve if player wins a play and vice-versa

            }
            if(computerWin){
                computerScore+=1;
                 ball = new Ball(canvas.width/2,canvas.height/2,(7+((round-1)/3)*6),Math.random()*8,15);//refer above

            }
            playerWin=false;//Boolean variables used to check for winner of each play as animation is stopped
            computerWin=false;// immediately after ball is out of bounds
            //Animation resumes if the round hasnt been won by either side
            if(computerScore<5&&playerScore<5){
                start=true;
                animate();
            }
            //Game is lost by user
            if(computerScore===5){
                startGame=0;
                gameOver.play();
                round=1;

                //This displays the court on screen along with message.
                gameScreen("loss");//Click Handler is Active 
            }
            //Round is won by user
            if(round<=3){
            if(playerScore===5){
                startGame=0;
                round+=1;
                roundWin.play();
                gameScreen("roundWin")//Refer Above
            }
        }
           //Game is won by user
            if(round>=4){
                startGame=0;
                victory.play();
                gameScreen("victory");//Refer Above
                
                round=1;
                
            }
            
        }, 1000);
    }
    gameScreen("begin");//Displays the court 
    //Ball moves with predefined velocity
    ball.update();
     
    //computerPaddles velocity depends on balls position wrt to it.
    computerPaddle.dy=(ball.y-(computerPaddle.y))*(1-((ball.x-computerPaddle.x)/(canvas.width*0.9)))/10;
    computerPaddle.update();

    //Checking contact of ball with both paddles
    if(ball.x-ball.radius<canvas.width*0.1+40&&ball.y>(computerPaddle.y-(computerPaddle.length/2))&&ball.y<(computerPaddle.y+(computerPaddle.length/2))){
        ball.dx=-ball.dx;
        ball.dy=-ball.dy;
         computerPaddle.dy=0;
         contact.play();
         computerPaddle.update();
    }
     
    if(ball.x+ball.radius>canvas.width*0.9-40&&(ball.y>playerPaddle.y-(playerPaddle.length/2)&&ball.y<(playerPaddle.y+(playerPaddle.length/2)))){
        ball.dx=-ball.dx;
         ball.dy=-ball.dy+playerPaddle.dy*0.8;
         contact.play();
    }
playerPaddle.update();

//Checking for Ball out of Bounds
if(ball.x<(canvas.width*0.1+35)){
    playerWin=true;
    start=false;
    miss.play();
    }
    if(ball.x>canvas.width*0.9-35){
        computerWin=true;
        start=false;
        miss.play();
    }
    
}

//function to display court on screen
function gameScreen(status){//Checks status and displays Appropriate Message
    c.fillStyle=colors[round-1];
    c.fillRect(0,0,canvas.width,canvas.height);
    c.strokeStyle="white";
    c.lineWidth=1;
    c.strokeRect(canvas.width*0.1,canvas.height*0.1,canvas.width*0.8,canvas.height*0.85);
    c.beginPath();
    c.moveTo(canvas.width/2,canvas.height*0.1);
    c.lineTo(canvas.width/2,canvas.height*0.95);
    c.strokeStyle="white";
    c.lineWidth=1;
    c.stroke();
    c.closePath();
    c.font="50px Courier New";
    c.fillStyle="white"
    if(status=="begin"&&startGame==0){
    c.fillText("Click To Begin",canvas.width/2-180,canvas.height/2+60);
    }
    if(status=="loss"){
    c.fillText("Game Over Click To Restart",canvas.width/2-300,canvas.height/2+60);
    }
    if(status=="roundWin"){
     c.fillText(`Round ${round} Click To Begin`,canvas.width/2-300,canvas.height/2+60);
    }
    if(status=="victory"){
      c.fillText("You Won! Click To Restart",canvas.width/2-300,canvas.height/2+60);

    }
    if(round<=3){
    c.save();
    
    c.font="30px Courier New";
    c.strokeText(`${computerScore}`,canvas.width*0.1+40+20,canvas.height*0.1-10,30);
    c.strokeText(`${playerScore}`,canvas.width*0.9-40-20,canvas.height*0.1-10,30);
    c.font="20px Courier New";
    if(status!="roundWin" &&status!="loss"){
    c.strokeText(`Round ${round}`,canvas.width/2-25,canvas.height*0.1-40);
    }
    c.font="25px Courier New";
    c.strokeText("5",canvas.width/2,canvas.height*0.1-10);
    c.restore();
    }
    
}
gameScreen("begin");
