package com.example.four_in_a_row.Controllers;

import com.example.four_in_a_row.Exceptions.InvalidGameException;
import com.example.four_in_a_row.Exceptions.InvalidParamException;
import com.example.four_in_a_row.Game.Game;
import com.example.four_in_a_row.Game.GameStorage;
import com.example.four_in_a_row.Game.LastChanges;
import com.example.four_in_a_row.Game.Player;
import com.example.four_in_a_row.Services.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

import static com.example.four_in_a_row.Game.GameStatus.FINISHED;

@RestController
@Slf4j
@AllArgsConstructor
//Разобраться в чем прикол Autowired
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player){
        log.info("Start game request: {}",player);
        return ResponseEntity.ok(gameService.createGame(player));
    }
//    @PostMapping("/connect")
//    public ResponseEntity<Game> connectById(@RequestBody ConnectRequest request) throws InvalidParamException, InvalidGameException {
//        log.info("Connect request: {}", request);
//        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
//    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connectById(@RequestBody ConnectRequest request) throws InvalidParamException, InvalidGameException {
        log.info("Connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }
//
    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectToRandom(@RequestBody Player player) throws InvalidGameException {
        log.info("Connect random: {}", player);
//        log.info();
        return ResponseEntity.ok(gameService.connectToRandomGame(player));
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gameplay (@RequestBody LastChanges request) throws InvalidGameException, InvalidParamException {
        log.info("gameplay: {}", request);
        Game game = gameService.gameplay(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getId(), game);
        return ResponseEntity.ok(game);
    }
}
