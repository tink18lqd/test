let curID = 0
let tf = true
let newID = 0
let text = ""
let author = ""
let userList = new Map()


const WebSocket = require('ws');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "sql5.freemysqlhosting.net",
    user: "sql5750015",
    password: "PFdqMZWnVW",
    database: "sql5750015"
});

db.connect((error) => {
    if(error){
        console.log(error);
        process.exit(1);
    }
    console.log("Siuuuuuuu");
})

let clients = 0

const wss = new WebSocket.Server({ port: 1190});

wss.on('connection', (ws) => {
    let thisUser = "";
    console.log(`okok -> ${ws}`);
    // console.log(check())
    // ws.send("Hello");
    ws.on('message', (message) => {
        console.log("User ->", message.toString());
        command = message.toString()
        thisUser = command;
        if(!userList.has(command)){
            userList.set(command, 0);
        }
        userList.set(command, userList.get(command) + 1);
        console.log(userList.get(command));
    });

    ws.on('close', () => {
        console.log(`BYBY => ${thisUser}`);
        userList.set(thisUser, userList.get(thisUser) -1);
        clients -= 1
    })
})

console.log("WE are in ws://localhost:1190");

// setInterval(() => {
//     console.log(check())
// }, 100)


function good(){
    db.query("SELECT * FROM `first` ORDER BY id DESC LIMIT 1", (error, result) => {
        if(error){
            console.log(error);
            return;
        }
        // t = JSON.parse(result)
        newID = result[0]['id'];
        text = result[0]['text'];
        author = result[0]['author'];
    })
    if(tf){
        tf = false
        curID = newID;
    }
    // console.log(newID)
    if(curID != newID){
        curID = newID
        // console.log(`${text} <=>=<=> ${author}`)
        return {tf_:true, id_:newID, te:text, au:author};
    }
    return {tf_: false, id_:newID, te:text, au:author};
}

setInterval(() => {
    al = good()
    if(al.tf_){
        // ws.send(`${al.au} => ${al.te}`);
        wss.clients.forEach((client) => {
            if(client.readyState == WebSocket.OPEN){
                // client.send(`${al.au} => ${al.te}`);
                client.send(JSON.stringify({author: al.au, text: al.te}));
            }
        })
        console.log(`${al.au} => ${al.te} : ${al.tf_} / id => ${al.id_}`)
    }
    // console.log(al.tf_);
}, 100);
