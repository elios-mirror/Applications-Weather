const Request = require('request');

const elios_sdk = require('elios-sdk');

const sdk = new elios_sdk.default();

export default class Weather {
  name: string = '';
  installId: string = '';

  requireVersion: string = '0.0.1';
  showOnStart: boolean = true;
  selectedDisplay: any = 3;

  widget: any;
  it: any;

  constructor() {
    console.log('Weather constructor.');
  }

  render(location: string) {
    let barometer = require("./svg/wi-barometer.svg");
    let wind = require("./svg/wi-strong-wind.svg");
    let humidity = require("./svg/wi-humidity.svg");


    Request("http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=0b903424166bfaef00a52f2945826e04&units=metric", (error: any, response: any, body: any) => {
      if (error) { console.log('error:', error); }
      let obj = JSON.parse(body);
      if (obj.cod != 200) {
        this.widget.html("<div style=\"text-align:center;width:fit-content\"><p style=\"font-weight:bold\">Error while loading weather application</p></div>");
      } else {
        let svgWeather = '';
        if (this.selectedDisplay == 2 || this.selectedDisplay == 3) {

          switch (obj.weather[0].main) {
            case ("Clear"):
            svgWeather = require("./svg/wi-day-sunny.svg")
            break;
            case ("Clouds"):
            svgWeather = require("./svg/wi-cloud.svg")
            break;
            case ("Rain"):
            svgWeather = require("./svg/wi-rain.svg")
            break;
            case ("Snow"):
            svgWeather = require("./svg/wi-snow.svg")
            break;
            case ("Drizzle"):
            svgWeather = require("./svg/wi-sprinkle.svg")
            break;
            case ("Fog"):
            case ("Haze"):
            case ("Mist"):
            svgWeather = require("./svg/wi-fog.svg")
            break;
            case ("Smoke"):
            svgWeather = require("./svg/wi-smoke.svg")
            break;
            case ("Sand"):
            case ("Dust"):
            case ("Ash"):
            svgWeather = require("./svg/wi-dust.svg")
            break;
            case ("Squall"):
            svgWeather = require("./svg/wi-strong-wind.svg")
            break;
            case ("Tornado"):
            svgWeather = require("./svg/wi-tornado.svg")
            break;
            default:
            svgWeather = require("./svg/wi-na.svg")
            break;
          }

        }
        if (this.selectedDisplay == 1) {
          console.log("selectedDisplay 1");
          this.widget.html("<div style=\"text-align:center;width:fit-content\"><p style=\"font-weight:bold\">" + obj.name + "</p><p style=\"font-weight:bolder;font-size:30px\">" + Math.round(obj.main.temp) + "°C</p><p>" + obj.weather[0].description + "</p></div>");
        }
        else if (this.selectedDisplay == 2) {
          console.log("selectedDisplay 2");
          this.widget.html("<div style=\"text-align:center;width:fit-content\"><p style=\"font-weight:bold\">" + obj.name + "</p><img style=\"float:left;height:60px;\" src=\"" + svgWeather + "\"/><p style=\"font-weight:bolder;font-size:30px;float:left;line-height:2\">" + Math.round(obj.main.temp) + "°C</p></div>");
        }
        else if (this.selectedDisplay == 3) {
          console.log("selectedDisplay 3");
          this.widget.html("<div style=\"text-align:center;width:100%;height:80px\"><p style=\"font-weight:bold\">" + obj.name + "</p><div style=\"width: fit-content;margin-left:auto;margin-right:auto;display:block;height:56px;margin-top:-10px\"><img style=\"float:left;height:60px;width:60px\" src=\"" + svgWeather + "\"/><p style=\"font-weight:bolder;font-size:30px;float:left;line-height:2;margin-right:5px\">" + Math.round(obj.main.temp) + "°C</p></div></div>"
          + "<div style=\"width:fit-content;line-height:2.4;height:35px;margin-left:auto;margin-right:auto;display:block;margin-top:-6px;\"><img style=\"float:left;height:35px;\" src=\"" + barometer + "\"/><p style=\"float:left\">" + obj.main.pressure + " hPa</p><img style=\"float:left;height:35px;\" src=\"" + humidity + "\"/><p style=\"float:left\">" + obj.main.humidity + " %</p></div>"
          + "<div style=\"width:fit-content;line-height:2.4;height:35px;margin-left:auto;margin-right:auto;display:block;margin-top:-6px;\"><img style=\"float:left;height:35px;\" src=\"" + wind + "\"><p style=\"float:left\">" + obj.wind.speed + " km/h</p></div>");
        }
        else
        this.widget.html("<div style=\"text-align:center;width:fit-content\"><p style=\"font-weight:bold\">" + obj.name + "</p><p style=\"font-weight:bolder;font-size:30px\">" + Math.round(obj.main.temp) + "°C</p><p>" + obj.weather[0].description + "</p></div>");
      }
    });
  }

  start() {
    console.log('Weather started.');

    let location = "Paris,FR";
    this.widget = sdk.createWidget();

    sdk.config().subscribe((config:any) => {
      if (config.location)
      location = config.location;
      if (config.display)
      this.selectedDisplay = config.display;
      this.render(location);
    });


    setInterval(() => {
      this.render(location);
    }, 600000); //10 min refresh
  }
}

const weather = new Weather();

weather.start();
