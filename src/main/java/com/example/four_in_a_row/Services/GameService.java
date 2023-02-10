package com.example.four_in_a_row.Services;

import com.example.four_in_a_row.Exceptions.InvalidGameException;
import com.example.four_in_a_row.Exceptions.InvalidParamException;
import com.example.four_in_a_row.Game.Game;
import com.example.four_in_a_row.Game.GameStorage;
import com.example.four_in_a_row.Game.Player;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Random;

import static com.example.four_in_a_row.Game.GameStatus.IN_PROGRESS;
import static com.example.four_in_a_row.Game.GameStatus.NEW;

@Service
//@AllArgsConstructor
public class GameService {

    public GameStorage getIns(){
        return GameStorage.getInstance();
    }
    public Game createGame(Player player){
        Game game = new Game();

//        ArrayList<ArrayList<Integer>> list = new ArrayList<>();
//        for (int i = 0; i < 6; i++){
//            list.add(new ArrayList<>());
//            for (int j = 0; j < 7; j++){
//                list.get(i).add(0);
//            }
//        }
//        ArrayList<ArrayList<Integer>>res = new ArrayList<>(list.stream().map(x -> new ArrayList<>(x)).collect(Collectors.toList()));
//        System.out.println(res);
        //Попробовать написать не через фор а как-нибудь через стримы
//        Arrays.fill(list, new ArrayList<Integer>() {0});
        game.setField(new int[6][7]);
//        game.setId(UUID.randomUUID().toString());
        game.setId(SubWithDigitsAndLetters(4));
        game.setPlayer1(player);
        game.setStatus(NEW);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public Game connectToGame(Player player, String gameId) throws InvalidParamException, InvalidGameException {
        if (!GameStorage.getInstance().getGames().containsKey(gameId)){
            throw new InvalidParamException("Game with provided ID doesn't exists");
        }
        Game game = GameStorage.getInstance().getGames().get(gameId);

        if (game.getPlayer2() != null){
            throw new InvalidGameException("Second Player is already being set");
        }
        game.setPlayer2(player);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGames(game);
        //Чекнуть нужно ли
        return game;
    }

    public Game connectToRandomGame(Player player) throws InvalidGameException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                    .filter(it -> it.getStatus().equals(NEW))
                    .findFirst().orElseThrow(() -> new InvalidGameException("None of the games have started"));
        game.setPlayer2(player);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGames(game);
        return game;
    }

    public static String SubWithDigitsAndLetters(int n) {
        Random random = new Random();
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < n; i++){
            int s = random.nextInt(73) + 48;

            while ((s >= 58 && s <= 64) || (s >= 91 && s <= 96)){
                s = random.nextInt(73) + 48;
            }

            str.append((char) s);
        }

        return str.toString();
    }

    public static Game gameplay(Game game){
        game.setField(game.getField());
        return game;
    }


    // Обработать уход игрока из игры
    // Правильно обработать рефреш
}
