<?php

namespace App\Entity;

use App\Repository\ScoreBoardRepository;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: ScoreBoardRepository::class)]
class ScoreBoard
{
    #[ORM\Id]
    #[ORM\Column(type: 'string', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'App\Services\DoctrineIdGenerator')]
    private ?string $id;

    #[ORM\Column(length: 150, nullable: false)]
    private string $pseudo;

    #[ORM\Column(nullable: false)]
    private int $score;

    #[ORM\Column(nullable: false)]
    private float $best_time;

    #[ORM\Column(nullable: false)]
    private float $average_time;
}
