<?php

namespace App\Controller;

use App\Entity\ScoreBoard;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ScoreBoardController extends AbstractController
{
    private array $json_options = [
        'json_encode_options' => \JSON_UNESCAPED_UNICODE,
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Headers' => 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS'
    ];

    public function __construct(private readonly ManagerRegistry $doctrine, private readonly SerializerInterface $serializer)
    {
    }

    #[Route('/get/tri/{tri}', name: 'getAllBoard', methods: ['GET', 'POST', 'OPTIONS'])]
    public function getAllBoard(?string $tri) : JsonResponse
    {
        if(!in_array($tri, ["score", "date", "best_time", "average_time"])){
            $tri = "score";
        }

        // TODO : voir si vraiment besoin tri dans l'api

        /** @var ScoreBoard[] $board */
        $board = $this->doctrine->getRepository(ScoreBoard::class)->findBy([], [$tri => "ASC"]);

        $data = $this->getArrayOfScoreBoard($board);

        // tri par score
//        array_multisort(array_column($data, "score"), SORT_ASC, $data);

        $data = $this->serializer->serialize($data, 'json');
        return new JsonResponse($data, Response::HTTP_OK, $this->json_options, true);
    }

    #[Route('/get/{pseudo}', name: 'getBoardOnePlayer', methods: ['GET', 'POST', 'OPTIONS'])]
    public function getBoardOnePlayer(string $pseudo) : JsonResponse
    {
        $board = $this->doctrine->getRepository(ScoreBoard::class)->findBy(["pseudo" => $pseudo], ["score" => "ASC"]);
        $data = $this->getArrayOfScoreBoard($board);

        $data = $this->serializer->serialize($data, 'json');
        return new JsonResponse($data, Response::HTTP_OK, $this->json_options, true);
    }

    /**
     * @param ScoreBoard[] $board
     * @return array
     */
    private function getArrayOfScoreBoard(array $board) : array
    {
        foreach ($board as $score){
            $data[] = [
                "pseudo" => $score->getPseudo(),
                "score" => $score->getScore(),
                "best_time" => $score->getBestTime(),
                "average_time" => $score->getAverageTime(),
                "date" => $score->getDate()
            ];
        }
        return $data ?? [];
    }

    #[Route('/set', name: 'setScoreBoard', methods: ['GET', 'POST', 'OPTIONS'])]
    public function setScoreBoard(Request $request) : Response
    {
        $doctrineManager = $this->doctrine->getManager();
        $date = new \DateTime();
        $board = new ScoreBoard();
        $board->setPseudo($request->get('pseudo'));
        $board->setDate($date);
        $board->setScore($request->get('score') ?? 0);
        $board->setBestTime($request->get('best_time') ?? 0);
        $board->setAverageTime($request->get('average_time') ?? 0);
        $doctrineManager->persist($board);
        $doctrineManager->flush();

        return new Response("OK", Response::HTTP_OK, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Headers' => 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS'
        ]);
    }
}
