var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
const { FRAME_TYPE } = require('xbee-api/lib/constants');
var C = xbee_api.constants;
//var storage = require("./storage")
require('dotenv').config()

const BROADCAST_ADDRESS = 'FFFFFFFFFFFFFFFF';
const ZIBGEE_1 = '0013A20041582EF0';
const ZIGBEE_2 = '0013A20041C345D2';

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
  destination64: ZIBGEE_1,//BROADCAST_ADDRESS,
  command: "D2",
  commandParameter: [0x05],
};
xbeeAPI.builder.write(frame_obj_led1);

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
        command: "D2",
        commandParameter: [0x04],
      };
      xbeeAPI.builder.write(frame_obj_led);
    }
  } else {
    //console.log(frame);
  }
});


// test MQTT
const mqtt = require('mqtt');
const topic = 'api-platform-iot';

const client = mqtt.connect('mqtt://127.0.0.1');

function mqttPublish(message) {
  client.publish(topic, message, { qos: 0, retain: false }, function(error) {
    if (error) {
      console.error(error)
    }
  });
}

client.on('connect', function() {

  console.log('[MQTT] Connected')

  client.subscribe(topic, () => console.log(`[MQTT] Subscribed to topic ${topic}`));

  mqttPublish('socket connected');
});

client.on('message', (topic, payload) => {
  console.log(`[MQTT] Received message: (${topic}) ${payload.toString()}`);
});
