var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
const { FRAME_TYPE } = require('xbee-api/lib/constants');
var C = xbee_api.constants;
//var storage = require("./storage")
require('dotenv').config()

const BROADCAST_ADDRESS = 'FFFFFFFFFFFFFFFF';


const SERIAL_PORT = process.env.SERIAL_PORT;

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

var start;

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

//Allumage led
var frame_obj_led1 = {
  type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
  destination64: BROADCAST_ADDRESS,
  command: "D2",
  commandParameter: [0x05],
};
// var frame_obj_led2 = {
//   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
//   destination64: "f436",
//   command: "D2",
//   commandParameter: [0x05],
// };
xbeeAPI.builder.write(frame_obj_led1);
// xbeeAPI.builder.write(frame_obj_led2);

start = new Date();


});

xbeeAPI.parser.on("data", function (frame) {

  if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    if (frame.digitalSamples.DIO1 === 0) {
      var time = new Date() - start;
      var rem16 = frame.remote16;


      console.log("Temps réaction : ");
      console.log(time);
      console.log(rem16);

     var frame_obj_led = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: frame.remote64,
        // destination16: rem16,
        command: "D2",
        commandParameter: [0x04],
      };
      console.log(frame_obj_led );

      xbeeAPI.builder.write(frame_obj_led);
    }
  } else {
    //console.log(frame);
  }
});
