# Configuration de mosquitto 

dernière version mosquitto sur ubuntu : 2.0.11      
configuration dans /etc/mosquitto/mosquitto.conf    

Il y a deux protocoles nécessaire à la communication React <-> MQTT <-> socket IOT,     
Pour la communication web, c'est le protocol ws (websockets), pour la communication avec les zigbee, on utilise le protocol tcp mqtt.   
Ainsi, pour pouvoir communiquer avec les deux en même temps, il faut que notre serveur mosquitto écoute sur deux ports differents, un par protocol.     

On peut donc ajouter la configuration default.conf dans /etc/mosquitto/conf.d/ :    
>listener 1883  
>protocol mqtt  
>
>listener 9001  
>protocol websockets    
>
>allow_anonymous true   

<br/>

# Application react

Installation des librairies avec npm    
> npm install

Démarrage du serveur react en local (http://localhost:3000)     
> npm start 