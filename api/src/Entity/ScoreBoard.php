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

    #[ORM\Column(nullable: true)]
    private ?\DateTimeInterface $date;

    public function getId() : string
    {
        return $this->id;
    }

    public function getPseudo() : string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo) : self
    {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getScore() : int
    {
        return $this->score;
    }

    public function setScore(int $score) : self
    {
        $this->score = $score;
        return $this;
    }

    public function getBestTime() : float
    {
        return $this->best_time;
    }

    public function setBestTime(float $best_time) : self
    {
        $this->best_time = $best_time;
        return $this;
    }

    public function getAverageTime() : float
    {
        return $this->average_time;
    }

    public function setAverageTime(float $average_time) : self
    {
        $this->average_time = $average_time;
        return $this;
    }

    public function getDate() : \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date) : self
    {
        $this->date = $date;
        return $this;
    }
}
