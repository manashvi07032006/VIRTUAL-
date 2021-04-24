var dog, dogIMG, happyDogIMG;
var database, foodS, foodStock;
var feedPet, addFood;
var fedTime, lastFed;
var foodObj, milk, milkIMg;
var form;
function preload(){
	dogIMG = loadImage("Dog1.png");
  happyDogIMG = loadImage("Dog2.png");
  milkIMG = loadImage("Milk.png");
}

function setup(){
  database = firebase.database();
	createCanvas(800, 500);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(650,300,150,150);
  dog.addImage(dogIMG);
  dog.scale = 0.2;

  milk = createSprite(570,320,50,50);
  milk.addImage(milkIMG);
  milk.visible = false;
  milk.scale = 0.1;

  feedPet = createButton("FEED THE DOG");
  feedPet.position(700, 95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(850, 95);
  addFood.mousePressed(addFoods);
}

function draw(){
  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255, 255, 254);
  textSize(20);
  if(lastFed>12){
    text("LastFeeded: " + lastFed%12 + " PM", 200, 60);
  }
  else if(lastFed === 0){
    text("Last Feed: 12 AM", 200, 60);
  }
  else{
    text("Last Feed: " + lastFed + " PM", 200, 60);
  }
  drawSprites();
  text("Food Stock: " + foodS, 200, 90);
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogIMG);
  milk.visible = true;
  if(foodS>0){
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
}

function addFoods(){
  if(foodS<50){
    foodS++;
    database.ref('/').update({
      Food: foodS
    })
  }
}