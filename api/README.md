# API WALL_REFLEX
___

## VERSION 
Symfony 5   
PHP 8.0

## TUTO RAPIDE COMMANDES Symfony
Pour intaller les modules PHP (/vendor) : 
> `composer install`

Pour clear les caches (/var) : Attention, inutile tant qu'on a pas associé de bdd
> `php bin/console cache:clear`

Pour migrer la bdd (ATTENTION : nécessite d'avoir configurer le lien dans config/packages/doctrine.yaml)
> Quand on créer une entité, on peut générer le repository et les getters et setters :  
> `php bin/console make:entity` 
>
> Pour créer le fichier de migrations (dans /migrations)    
> `php bin/console make:migration`  
> 
> ATTENTION : Si plusieurs fichiers dont certains sont obsolète et n'ont pas été exécuter, les supprimer avant de passer à la suite 
> Vous pouvez changer le script à la main avant de l'éxécuter si vous voulez. Regarder le script peut aussi permettre de vérifier que l'on ne s'est pas tromper de base (cela peut arriver sur des projets ou l'on utilise plusieurs bdd d'horizons différents)
> 
> Ainsi, pour exécuter le script de migration et donc créer ou modifier la structure de vos tables en BDD :
> `php bin/console doctrine:migrations:migrate`

Pour démarrer le serveur en local :
> `symfony server:start --no-tls`   
> Vous pourrez alors accéder au route à la racine http://127.0.0.1:8000




