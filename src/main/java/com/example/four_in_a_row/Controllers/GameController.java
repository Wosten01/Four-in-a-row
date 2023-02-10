package com.example.four_in_a_row.Controllers;

import com.example.four_in_a_row.Exceptions.InvalidGameException;
import com.example.four_in_a_row.Exceptions.InvalidParamException;
import com.example.four_in_a_row.Game.Game;
import com.example.four_in_a_row.Game.GameStorage;
import com.example.four_in_a_row.Game.Player;
import com.example.four_in_a_row.Services.GameService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@Slf4j
//@AllArgsConstructor
//Разобраться в чем прикол Autowired
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

//    @Autowired
    public GameController(GameService gameService, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameService = gameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player){
        log.info("Start game request: {}",player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

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
    public ResponseEntity<Game> gamePlay (@RequestBody Game userGame){
        log.info("gameplay: {}", userGame);
        int[][] a = userGame.getField();
        Random rnd = new Random();
        a[rnd.nextInt(5)][rnd.nextInt(6)] = 100;
        userGame.setField(a.clone());
        simpMessagingTemplate.convertAndSend(String.format("/topic/game-progress %s", userGame.getId()), userGame);
        return ResponseEntity.ok(userGame);
    }

    @GetMapping("storage")
    public ResponseEntity<GameStorage> gamePlay (){
        return ResponseEntity.ok(gameService.getIns());
    }

}
