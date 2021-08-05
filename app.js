const express = require("express");
const app = express();
const port = 3000;
const request = require('request');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.set("views", "./views");
app.set("view engine", "ejs");

// Default page
app.get("", (req, res) => {
    res.render("index", { iconImg: "img/icon.png", head: "Welcome to Wapp", text: "Your friendly neighborhood weather application" });
});

// About Page
app.get("/about", (req, res) => {
    res.render("about");
});

//Page After User Search
app.post("/", (req, res) => {
    function capitalize(str) {
        const arrOfWords = str.split(" ");
        const arrOfWordsCased = [];

        for (let i = 0; i < arrOfWords.length; i++) {
            const word = arrOfWords[i];
            arrOfWordsCased.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
        };

        return arrOfWordsCased.join(" ");
    }

    let location = capitalize(req.body.cityName);
    const apiKey = "8961ebce25f3e473dc74aa1b60443d15";
    const unit = "imperial";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

    request(url, function (err, response, body) {
        if (err) {
            res.render("index", { iconImg: "img/icon2.png", text: null, head: "Error, please try again" });
        } else {
            let weatherData = JSON.parse(body);
            if (weatherData.main == undefined) {
                res.render("index", { iconImg: "img/icon2.png", text: null, head: "Location not found, please try again" });
            } else {
                let weatherData = JSON.parse(body);
                let temp = Math.floor(weatherData.main.temp);
                let weatherDescription = weatherData.weather[0].description;
                weatherDescription = weatherDescription.slice(0, 1).toUpperCase() + weatherDescription.slice(1);
                let icon = weatherData.weather[0].icon;
                let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                res.render("index", { iconImg: `${iconUrl}`, head: `The temperature in ${location} is ${temp}℉`, text: `Current conditions: ${weatherDescription}` });
            }
        }
    });
});




//Listen on port
app.listen(port, () => {
    console.log("Server is running on port 3000.");
});