package com.example.four_in_a_row.Controllers;

import com.example.four_in_a_row.Exceptions.InvalidGameException;
import com.example.four_in_a_row.Exceptions.InvalidParamException;
import com.example.four_in_a_row.Game.DTO.ConnectRequest;
import com.example.four_in_a_row.Game.Game;
import com.example.four_in_a_row.Game.DTO.LastChanges;
import com.example.four_in_a_row.Game.Player;
import com.example.four_in_a_row.Services.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@Slf4j
@AllArgsConstructor
@RequestMapping("")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping("/")
    public String mainPage() {
        return "greeting";
    }

    //Сделать чтобы id отображался вверху страницы, оттуда я его смогу если что забрать и положить куда мне нужно
    @GetMapping("/game/{id}")
//    @RequestMapping(value = "/mainPage", method = RequestMethod.GET)
    public String gamePage(@PathVariable String id) {
        return "gameplay";
    }

    @ResponseBody
    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player){
        log.info("Start game request: {}",player);
//        gameplayPage();
        return ResponseEntity.ok(gameService.createGame(player));
    }
    @ResponseBody
    @PostMapping("/connect/split_screen")
    public ResponseEntity<Game> startSplitScreen(@RequestBody Player player1, @RequestBody Player player2){
        log.info("Start game request: {} + {} -> Split Screen Game",player1, player2);
//        gameplayPage();
        return ResponseEntity.ok(gameService.connectToSplitScreenGame(player1, player2));
    }
//
    @ResponseBody
    @PostMapping("/connect")
    public ResponseEntity<Game> connectById(@RequestBody ConnectRequest request) throws InvalidParamException, InvalidGameException {
        log.info("Connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }
//
    @ResponseBody
    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectToRandom(@RequestBody Player player) throws InvalidGameException {
        log.info("Connect random: {}", player);
//        log.info();
        return ResponseEntity.ok(gameService.connectToRandomGame(player));
    }



    @ResponseBody
    @PostMapping("/gameplay")
//    @MessageMapping()
    public ResponseEntity<Game> gameplay (@RequestBody LastChanges request) throws InvalidGameException, InvalidParamException {
        log.info("gameplay: {}", request);
        Game game = gameService.changePlayer(request);
        simpMessagingTemplate.convertAndSend("/player/game-progress/" + game.getId(), game);
        return ResponseEntity.ok(game);
    }
}
