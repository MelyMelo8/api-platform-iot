<?php

namespace App\Services;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Id\AbstractIdGenerator;
use Symfony\Component\Uid\Factory\UlidFactory;
use Symfony\Component\Uid\Ulid;

final class DoctrineIdGenerator extends AbstractIdGenerator
{
    private ?UlidFactory $factory;

    public function __construct(UlidFactory $factory = null)
    {
        $this->factory = $factory;
    }

    /**
     * doctrine/orm < 2.11 BC layer.
     */
    public function generate(EntityManager $em, $entity): string
    {
        return $this->generateId($em, $entity);
    }

    public function generateId(EntityManagerInterface $em, $entity): string
    {
        if ($this->factory) {
            return $this->factory->create()->toRfc4122();
        }

        $ulid = new Ulid();

        return $ulid->toRfc4122();
    }
}
