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

    public function __construct(private ManagerRegistry $doctrine, private SerializerInterface $serializer)
    {
    }

    #[Route('/get/tri/{tri}', name: 'getAllBoard')]
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
        return new JsonResponse($data, Response::HTTP_OK, ['json_encode_options' => \JSON_UNESCAPED_UNICODE], true);
    }

    #[Route('/get/{pseudo}', name: 'getBoardOnePlayer')]
    public function getBoardOnePlayer(string $pseudo) : JsonResponse
    {
        $board = $this->doctrine->getRepository(ScoreBoard::class)->findBy(["pseudo" => $pseudo], ["score" => "ASC"]);
        $data = $this->getArrayOfScoreBoard($board);

        $data = $this->serializer->serialize($data, 'json');
        return new JsonResponse($data, Response::HTTP_OK, ['json_encode_options' => \JSON_UNESCAPED_UNICODE], true);
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
                "date" => $score->getDate()->format("d/m/Y H:i:s")
            ];
        }
        return $data ?? [];
    }

    #[Route('/set', name: 'setScoreBoard')]
    public function setScoreBoard(Request $request) : Response
    {
        $doctrineManager = $this->doctrine->getManager();
        $date = new \DateTime();
        $board = new ScoreBoard();
        $board->setPseudo($request->query->get('pseudo'));
        $board->setDate($date);
        $board->setScore($request->query->get('score'));
        $board->setBestTime($request->query->get('best_time'));
        $board->setAverageTime($request->query->get('average_time'));
        $doctrineManager->persist($board);
        $doctrineManager->flush();

        return new Response("OK");
    }
}
