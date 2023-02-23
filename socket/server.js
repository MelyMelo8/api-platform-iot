var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
const { FRAME_TYPE } = require('xbee-api/lib/constants');
var C = xbee_api.constants;
//var storage = require("./storage")
require('dotenv').config()

const mqtt = require("./mqtt_handler.js");

const BROADCAST_ADDRESS = 'FFFFFFFFFFFFFFFF';

const SERIAL_PORT = process.env.SERIAL_PORT;

// On renvoie un nombre aléatoire entre une valeur min (incluse)
// et une valeur max (exclue)
function getRandom(min, max) {
  number =  Math.random() * (max - min) + min;
  switch (number) {
    case 1:
      destination = process.env.ZIBGEE_1;
      break;
    case 2:
      destination = process.env.ZIBGEE_2;
      break;
    case 3:
      destination = process.env.ZIBGEE_3;
      break;
    case 4:
      destination = process.env.ZIBGEE_4;
      break;
    default:
      break;
  }
  return destination;
}


var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: Number.parseInt(process.env.SERIAL_BAUDRATE) || 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

var timer;
var timeMax;
var score;
var fisrtled;
var lose;

var start;
mqtt.setStartCallback(() => start = true);

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: BROADCAST_ADDRESS,
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

lose = false;
fisrtled=true;
score=0;
timeMax=10000;
start=false;
});

xbeeAPI.parser.on("data", function (frame) {
  if(start==true){
    if(lose==true){
      //quit game
      sleep(500);
      var frame_obj_led = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: BROADCAST_ADDRESS,
        command: "D2",
        commandParameter: [0x04],
      };
      sleep(500);
      xbeeAPI.builder.write(frame_obj_led);
      var frame_obj_led = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: BROADCAST_ADDRESS,
        command: "D2",
        commandParameter: [0x05],
      };
      xbeeAPI.builder.write(frame_obj_led);
      sleep(500);
      xbeeAPI.builder.write(frame_obj_led);
      var frame_obj_led = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: BROADCAST_ADDRESS,
        command: "D2",
        commandParameter: [0x04],
      };
      //Quitter Partie
      mqtt.publish('game_over');
      start = false;
      lose = false;
      fisrtled=true;
      score=0;
      timeMax=10000;
    } else if(fisrtled==true){
      //Tirage Aléatoire
      destination = getRandom(1, 5);
      //Allumage led
      var frame_obj_led1 = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: destination,
        command: "D2",
        commandParameter: [0x05],
      };
      xbeeAPI.builder.write(frame_obj_led1);
      fisrtled=false;
      timer = new Date();

    } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
      if (frame.digitalSamples.DIO1 === 0) {
        if(frame.remote64==destination){
          var time = new Date() - timer;
          console.log("Temps réaction : ");
          console.log(time);
          //On etteind la led
          var frame_obj_led = {
              type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
              destination64: frame.remote64,
              command: "D2",
              commandParameter: [0x04],
          };
          xbeeAPI.builder.write(frame_obj_led);
          if(time<timeMax){
            score = scrore +1;
            mqtt.publish('score '+score);
            mqtt.publish('time '+time);
            timeMax = timeMax-10;
            //Tirage Aléatoire
            destination = getRandom(1, 5);
            //Allumage led
            var frame_obj_led1 = {
              type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
              destination64: destination,
              command: "D2",
              commandParameter: [0x05],
            };
            xbeeAPI.builder.write(frame_obj_led1);
            timer = new Date();
          } else {
            //CAS PERDU
            //on allume toute les led
            var frame_obj_led = {
              type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
              destination64: BROADCAST_ADDRESS,
              command: "D2",
              commandParameter: [0x05],
            };
            xbeeAPI.builder.write(frame_obj_led);
            lose = true;
          }
        } else { //Mauvais bouton
          //CAS PERDU
          //on allume toute les led
          var frame_obj_led = {
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: BROADCAST_ADDRESS,
            command: "D2",
            commandParameter: [0x05],
          };
          xbeeAPI.builder.write(frame_obj_led);
          lose = true;
        }
      }
    }
  }
});