# API Reflex_Wall

----

## Prérequis et versions 

PHP 8.1		
Symfony 6.2	    
Mariadb-10.6.11 (package apt: _mariadb-server_)	

Driver PHP : pdo_mysql (package apt : _php-pdo-mysql_)	

## Rappel pour créer l'utilisateur et la base côté Mariadb

Sur un terminal **à la première connexion** : 
> `sudo mariadb`    
> 
> Changement du password root pour les prochaines connexions    	
> `ALTER USER root IDENTIFIED BY [your_mdp];`
> 
> Pour connaître l'ensemble des utilisateurs sauvegardés par mariadb 		
> `SELECT user, host, plugin, password FROM mysql.user;`

Sur un terminal **aux connexions suivantes** : 
> `mariadb -uroot -p` 
> 
> Création de l'utilisateur de notre app 	
> `CREATE USER api_reflex_wall IDENTIFIED BY 'reflex_wall';	`
> 
> Création de la database	    
> `CREATE DATABASE reflex_wall;`
> 
> Gestion des privilèges pour ne donner l'accès à notre nouvel utilisateur qu'a la base de données que l'on vient de créer 		
> `GRANT ALL PRIVILEGES ON reflex_wall.* TO api_reflex_wall@'%';`		

*Remarque* : On donne l'accès à notre utilisateur sans préciser d'adresse ip d'origine pour que ce soit plus simple, mais c'est moins sécurisé.


## Commandes Symfony pour la gestion du projet

Toutes les commandes qui vont suivre doivent ce faire à la racine du **dossier api/ sur un terminal**.

### Composer : gestion des packages - librairies PHP 

> Création des dossiers vendor et var et du composer.lock (dans .gitignore) :   
> `composer install`    
>  
> On a alors l'ensemble des librairies nécessaire à notre projet accessible     
> Pour rajouter une librairie : `composer require [package]`
> 
> Pour nettoyer les caches et mettre à jour une modification du .env par exemple :      
> `php bin/console cache:clear`

### Doctrine pour la gestion de la BDD

Ce projet contient une configuration Doctrine, on peut donc gérer les modifications de BDD directement depuis les commandes symfony. Les tables sont donc définies par des Entités dans le répertoire [src/Entity](src/Entity). La configuration doctrine se touve dans le fichier [config/packages/doctrine.yaml](config/packages/doctrine.yaml).  

**Remarque :** depuis la version PHP 8.0, on peut utiliser des Attributes (#[]) au lieu des Annotations (/** */). Ceci est conseillé et plus rapide car natif de PHP. Cependant, ce que j'ai découvert, c'est que depuis la version PHP 8.1 ou Symfony 6.0, il faut aussi préciser le changement dans la configuration doctrine. 

Voici les quelques commandes que j'utilise : 
> Pour générer les getters et setters des Entity :  
> `php bin/console make:entity --regenerate`
> 
> Pour créer le fichier de migration :  
> `php bin/console make:migration` 
> 
> Pour pousser la migration en BDD :    
> `php bin/console doctrine:migrations:migrate`

### Démarrage du projet en local 

Démarrage du projet, donc les routes seront accessible sur http://127.0.0.1:8000 
> `symfony server:start --no-tls`   

Si besoin de forcer l'arrêt du serveur  
> `symfony server:stop`
