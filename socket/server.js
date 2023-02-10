var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
//var storage = require("./storage")
require('dotenv').config()


const SERIAL_PORT = process.env.SERIAL_PORT;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
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

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});
//test
// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))
let test = false;

xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it

  // console.log(frame);
  if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    console.log(frame);
    if(frame.digitalSamples.DIO3 === 0){
      console.log("Bouton Appuyé ...\n");

      var frame_obj_led = { 
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: "FFFFFFFFFFFFFFFF",
        command: "D2",
        commandParameter: [test ? 0x04 : 0x05],
      };
      test = !test;

      xbeeAPI.builder.write(frame_obj_led);
    }
  }

});
