var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var users = [
    { id: 1, log: "AAA", pass: "PASS1", age: 10, student: "checked", gender: "m" },
    { id: 2, log: "BBB", pass: "PASS2", age: 18, student: "", gender: "k" },
    { id: 3, log: "CCC", pass: "PASS3", age: 12, student: "checked", gender: "m" },
    { id: 4, log: "aaa", pass: "pass1", age: 17, student: "", gender: "k" },
    { id: 5, log: "bbb", pass: "pass2", age: 14, student: "", gender: "k" },
    { id: 6, log: "ccc", pass: "pass3", age: 20, student: "checked", gender: "m" }
]

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));   
});

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"));   
});

app.post('/register', function(req, res) {
    let present = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].log == req.body.userName) {
            present = true;
            break
        }
    }
    if (present == false) {
        res.send("Witaj " + "<b>" + req.body.userName + "</b>" + ", zostałeś zarejestrowany.");
        
        if (req.body.student == "on") {
            users.push({id:users.length+1, log:req.body.userName, pass:req.body.password, age:req.body.ages, student:"checked", gender:req.body.gender})
        }
        else {
            users.push({id:users.length+1, log:req.body.userName, pass:req.body.password, age:req.body.ages, student:"", gender:req.body.gender})
        }
    }
    else {
        res.send("Użytkownik o loginie: " + "<b>" + req.body.userName + "</b> już znajduje sie w bazie." )
    }
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"));   
});

var authorized = false;
app.post('/login', function(req, res) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].log == req.body.userName && users[i].pass == req.body.password) {
            authorized = true
            break
        }
    }

    if (authorized == true) {
        res.redirect("/admin")
    } 
    else {
        res.send("<b>BŁĄD</b> Dane logowania niepoprawne. Spróbuj ponownie.")
    }
});

app.get('/admin', function (req, res) {
    if (authorized == true) {
        res.sendFile(path.join(__dirname + "/static/admin_logged.html"));
    }
    else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
});

app.get('/logout', function (req, res) {
    if (authorized == true) {
        authorized = false;
        res.redirect("/");
    }
    else {
        res.redirect("/");
    }
});

function sort(req, res) {
    let decrease;

    if (req.body.sort == "down") {
        decrease = true;
    } else {
        decrease = false;
    }

    if (authorized == false) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
        return
    }

    let sortedArray, incr, decr;
    
    if (decrease == true) {
        sortedArray = users.sort(function (x, y) {
            return parseFloat(y.age) - parseFloat(x.age);
        })
        decr = "checked"
    }
    else {
        sortedArray = users.sort(function (x, y) {
            return parseFloat(x.age) - parseFloat(y.age);
        })
        incr = "checked"
    }
    res.send("<!DOCTYPE html><head><link rel='icon' href='./gfx/fawkes_icon.png'><style>body,html {background-color: #121212 !important;}*{color: #d4d3d3 !important;}</style><meta charset='UTF-8'><link rel='stylesheet' href='./css/style.css'><title>Admin page - sort</title></head><body><div class='container'><div class='header' style='background-color: #118800;'><a href='./'>main</a><a href='./register'>register</a><a href='./login'>login</a><a href='./admin'>admin</a><a href='./logout'>logout</a></div><div class='header' style='background-color: #26255a;''><a href='./sort'>sort</a><a href='./gender'>gender</a><a href='./show'>show</a></div><div class='content' style='height: 90vh;'><form class='part2' onchange='this.submit()' method='POST'><input name='sort' type='radio' value='up'" + incr + "><label for='sort'>Increasing &darr;</label><input name='sort' type='radio' value='down'" + decr + "><label for='sort'>Decreasing &uarr;</label></form>" + array(sortedArray, ["id", "log", "pass", "age"]) + "</div></div></body></html>")
}

app.get('/sort', sort);
app.post('/sort', sort);

function array(table, keys = ["id", "log", "pass", "age", "student", "gender"]) {

    returnValue = '<table>'

    for (let x = 0; x < table.length; x++) {
        row = '<tr>'
        for (let y = 0; y < Object.keys(table[x]).length; y++) {
            if (keys.includes(Object.keys(table[x])[y])) {
                row += '<td>' + Object.keys(table[x])[y] + ': ' + Object.values(table[x])[y] + '</td>'
            }
        }
        returnValue += row + '</tr>'
    }

    return returnValue + '</table>'
}

app.get('/gender', function(req, res) {
    if (authorized == true) {
        usersK = users.filter(function (user) {
            return user.gender == "k"
        })
        usersM = users.filter(function (user) {
            return user.gender == "m"
        })
        res.send("<!DOCTYPE html><head><link rel='icon' href='./gfx/fawkes_icon.png'><style>td{width:50% !important;}body,html {background-color: #121212 !important;}*{color: #d4d3d3 !important;}</style><meta charset='UTF-8'><link rel='stylesheet' href='./css/style.css'><title>Admin page - gender</title></head><body><div class='container'><div class='header' style='background-color: #118800;'><a href='./'>main</a><a href='./register'>register</a><a href='./login'>login</a><a href='./admin'>admin</a><a href='./logout'>logout</a></div><div class='header' style='background-color: #26255a;''><a href='./sort'>sort</a><a href='./gender'>gender</a><a href='./show'>show</a></div><div class='content' style='height: 90vh;'>" + array(usersK, ["id", "gender"]) + array(usersM, ["id", "gender"]) + "</div></div></body></html>")
    }
    else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
});

function sort2() {
    users.sort(function (x, y) {
        return parseFloat(x.id) - parseFloat(y.id);
    })
}
app.get('/show', function(req, res) {
    if (authorized == true) {
        sort2();
        let content = ""
        for (let i of users) {
            content += "<tr>"
            for (let [key, value] of Object.entries(i)) {
                if (`${key}` == "student") {
                    if (`${value}` == "checked") {
                        content += "<td>" + `${key}:` + "<input style='width: 30px; height: 20px' type='checkbox' checked disabled>" + "</td>"
                    }
                    else {
                        content += "<td>" + `${key}:` + "<input style='width: 30px; height: 20px' type='checkbox' disabled>" + "</td>"
                    }
                }
                else {
                    content += "<td>" + `${key}: ${value}` + "</td>"  
                }
                
            }
            content += "</tr>"
        }
        res.send("<!DOCTYPE html><head><link rel='icon' href='./gfx/fawkes_icon.png'><style>body,html {background-color: #121212 !important;}*{color: #d4d3d3 !important;}</style><meta charset='UTF-8'><link rel='stylesheet' href='./css/style.css'><title>Admin page - show</title></head><body><div class='container'><div class='header' style='background-color: #118800;'><a href='./'>main</a><a href='./register'>register</a><a href='./login'>login</a><a href='./admin'>admin</a><a href='./logout'>logout</a></div><div class='header' style='background-color: #26255a;''><a href='./sort'>sort</a><a href='./gender'>gender</a><a href='./show'>show</a></div><div class='content' style='height: 90vh;'><table>" + content + "</table></div></div></body></html>")
    }
    else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
});

app.use(express.static('static'));
app.listen(PORT, function () { 
    console.log("Serwer uruchomiono na porcie " + PORT )
});