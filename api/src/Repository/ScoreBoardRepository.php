<?php

namespace App\Repository;

use App\Entity\ScoreBoard;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ScoreBoard>
 *
 * @method ScoreBoard|null find($id, $lockMode = null, $lockVersion = null)
 * @method ScoreBoard|null findOneBy(array $criteria, array $orderBy = null)
 * @method ScoreBoard[]    findAll()
 * @method ScoreBoard[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ScoreBoardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ScoreBoard::class);
    }

    public function save(ScoreBoard $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ScoreBoard $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
