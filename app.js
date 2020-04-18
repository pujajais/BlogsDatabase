// init project
const express = require("express"); // the library we will use to handle requests
const mongodb = require("mongodb"); // load mongodb
const readlineSync = require('readline-sync');

const port = 4567; // port to listen on
const app = express(); // instantiate express
app.use(require("cors")()); // allow Cross-domain requests
app.use(require("body-parser").json()); // automatically parses request data to JSON

// MongoDBURI⬇
const uri = "mongodb://cs5220stu14:gOl5isKQnafB@ecst-csproj2.calstatela.edu:6317/cs5220stu14"; // put your URI HERE

async function main() {
  let client = await mongodb.MongoClient.connect(uri, {useUnifiedTopology: true});
  let db = client.db('cs5220stu14');

  while (true) {
    mainSelection = await mainMenu(db);
    if (mainSelection == -1) {
      break;
    }

    while (true) {
      userSelection = await userMenu(mainSelection, db);
      if (userSelection == -1) {
        break;
      }

      switch (userSelection) {
        case 0:
          await getArticles(mainSelection, db);
          break;
        case 1:
          await updateUserFirstName(mainSelection, db);
          break;
        case 2:
          await updateUserLastName(mainSelection, db);
          break;
        case 3:
          await updateEmail(mainSelection, db);
          break;
      }
    }
  }

  console.log("Closing connection to db...");
  client.close();
}

function keyInSelect(arr, prompt, cancel, cancelPrompt) {
  console.log();
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    console.log(`[${index+1}] ${element}`);
  }

  console.log(`[${cancelPrompt}] ${cancel}`)

  var selected = readlineSync.keyIn(`${prompt}: `);

  if (selected == cancelPrompt) {
    return -1;
  }

  return parseInt(selected)-1;
}

//Main Menu
async function mainMenu(db) {
  var results = await db.collection('users').find({});
  var array = await results.toArray();
  array = array.map(x => x.firstName + ' ' + x.lastName);
  var index = keyInSelect(array, 'Please enter your choice', 'Exit', 'x');
  return index;
}

//User Menu
async function userMenu(mainSelection, db) {
  var results = await db.collection('users').find({});
  var res = await results.toArray();
  console.log("\nUser - ", res[mainSelection].firstName + ' ' + res[mainSelection].lastName);
  var arrayUserMenu = ['List the articles authored by the user', 'Change first name', 'Change last name', 'Change email'];
  indexUserMenu = keyInSelect(arrayUserMenu, 'Please enter your choice', 'Back to Main Menu', 'b');

  return indexUserMenu;
}



//1.get the articles by the user
async function getArticles(mainIndexSelected, db) {
  var results = await db.collection('users').find({});
  var userData = await results.toArray();
  console.log("\nThe articles authored by the " + userData[mainIndexSelected].firstName + ' ' +
    userData[mainIndexSelected].lastName + ' are :');
  var userId = userData[mainIndexSelected]._id;
  await getArticlesUserId(userId, db);
}

// Get the Article one by one
async function getArticlesUserId(userId, db) {
  var results = await db.collection('articles').find({'author': userId});
  var userData = await results.toArray();
 
  console.log(userData.map(x => x.title));
}

//Need to club the update in
//2.Update user's First Name
async function updateUserFirstName(mainIndexSelected,db) {
  var userUpdatedFirstName = readlineSync.question('please input the First Name to be updated? ');
  var results = await db.collection('users').find({});
  var userData= await results.toArray();
  var userId = userData[mainIndexSelected]._id;
  const collection = await db.collection('users');
  // Update document where a is 2, set b equal to 1
  await collection.updateOne({ _id: userId }, { $set: { firstName: userUpdatedFirstName } });
}

//3.Update User's Last Name
async function updateUserLastName(mainIndexSelected,db) {
  var userUpdatedLastName = readlineSync.question('please input the Last Name to be updated? ');
  var results = await db.collection('users').find({});
  var userData= await results.toArray();
  var userId = userData[mainIndexSelected]._id;
  const collection = await db.collection('users');
  // Update user's last Name
  await collection.updateOne({ _id: userId }
    , { $set: { lastName: userUpdatedLastName } });

}

//4. Update Email
async function updateEmail(mainIndexSelected,db) {
  var userUpdatedEmail = readlineSync.question('please input the email to be updated? ');
  var results = await db.collection('users').find({});
  var userData= await results.toArray();
  var userId = userData[mainIndexSelected]._id;
  const collection = await db.collection('users');
  await collection.updateOne({ _id: userId }
    , { $set: { email: userUpdatedEmail } });
}

main();