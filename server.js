// SERVER SERVES DOCUMENTS
const express = require('express') //loads the module
const app = express() //executes the module, starts express
const bodyParser = require('body-parser') //loads the module
const MongoClient = require('mongodb').MongoClient //loads the module

let db, collection; //empty variables that will be defined later

const url = 'mongodb+srv://Will:password1234@cluster2.vhhzs.mongodb.net/Cluster2?retryWrites=true&w=majority'
const dbName = "palindrome-phrases";

app.listen(7000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true
    }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        collection = db.collection('phrases')
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //middle-ware setup
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => { //requesting from the server to render the index.ejs
  collection.find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {phrases: result}) //returns whatever phrases are already stored in the db
  })
})

app.get('/check/:phrases', (req, res) => { //set up a handler to handle get requests to /phrases
  collection.insertOne({name: req.params.phrases}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
      const checker = {
        reg : /[\W_]/g,
        // The above function uses a regular expression. A regular expression is a sequence of characters that specify and certain search pattern.
        // the forward slash signifies the start of a regular expression
        // back slash capital W denotes non alpha numeric characters.
        // having the underscore removes underscores
        // g signifies global which tells to check the entire string
        string : req.params.phrases,
        result : '',
        stringChecker() {
            let lowerCase = this.string.toLowerCase().replace(this.reg, "")
        // this variable takes the value of string and removes all alpha numeric characters and underscores from the users input, a returns back the new string.
            let reversed = lowerCase.split("").reverse().join("")
        //this converts the string into an array of letters, reverses them, and then joins them back together as a reversed string. It also makes it all lowercase.
            if (this.string === ''){
                this.result = 'please enter something in'
            } else if (reversed === lowerCase)  {
                this.result = `${this.string} is a palindrome, W`    
            }
            else{
                this.result = `${this.string} isn't a palindrome, L`
            }
        }
      }
      checker.stringChecker()
    res.send({result:checker.result})
  })
})