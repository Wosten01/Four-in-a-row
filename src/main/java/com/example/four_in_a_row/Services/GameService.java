package com.example.four_in_a_row.Services;

import com.example.four_in_a_row.Exceptions.InvalidGameException;
import com.example.four_in_a_row.Exceptions.InvalidParamException;
import com.example.four_in_a_row.Game.Game;
import com.example.four_in_a_row.Game.GameStorage;
import com.example.four_in_a_row.Game.DTO.LastChanges;
import com.example.four_in_a_row.Game.Player;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Random;

import static com.example.four_in_a_row.Game.GameStatus.*;



@Service
//@AllArgsConstructor
public class GameService {

//    private final GameStorage gameStorage;

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
        GameStorage.getInstance().setGame(game);
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
        GameStorage.getInstance().setGame(game);
        //Чекнуть нужно ли
        return game;
    }

    public Game connectToRandomGame(Player player) throws InvalidGameException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                    .filter(it -> it.getStatus().equals(NEW))
                    .findFirst().orElseThrow(() -> new InvalidGameException("None of the games have started"));
        game.setPlayer2(player);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().setGame(game);
        return game;
    }

    private static String SubWithDigitsAndLetters(int n) {
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

    public Game gameplay(LastChanges lastChanges) throws InvalidParamException, InvalidGameException {
        String id = lastChanges.getGameId();

        if (!GameStorage.getInstance().getGames().containsKey(id)) {
            throw new InvalidParamException("Game not found");
        }

        Game game = GameStorage.getInstance().getGames().get(id);
        if (game.getStatus().equals(FINISHED)) {
            throw new InvalidGameException("Game is already finished");
        }
        ArrayList<int[]> coordinates = lastChanges.getCoordinates();

        int chip = lastChanges.getPlayerNum();
        int[][] field = game.getField();
        for (int[] coordinate : coordinates) {
            field[coordinate[0]][coordinate[1]] = chip;
        }
//        Boolean xWinner = checkWinner(game.getBoard(), TicToe.X);
//        Boolean oWinner = checkWinner(game.getBoard(), TicToe.O);
//
        if (checkWinner(field, chip)) {
            game.setWinner(chip);
        }
        game.setWinFlag(true);
        GameStorage.getInstance().setGame(game);
        return game;
    }

    private boolean checkWinner(int[][] nums, int chip){
        int c = 0;
        //Проход по массиву по горизонталям
        for (int i = 0; i < row; i++) {
            int j = 0;
            while (j < col && col - j + c >= 4) {
                if (chip == nums[i][j]){
                    c++;
                    if (c == 4){
                        // console.log("Г")
                        return true;
                    }
                }
                else{
                    c = 0;
                }
                j++;
            }
            j = 0;
            c = 0;
        }
        //Проход по массиву по вертикали
        for (int j = 0; j < col; j++) {
            int i = row - 1;
            while (i >= 0 && c + i + 1 >= 4) {
                if (chip == 0) {
                    c = 0;
                    break;
                }
                else if (chip == nums[i][j]){
                    c++;
                    if (c == 4){
                        c = 0;
                        // console.log("В");
                        return true;
                    }
                }
                i--;
            }
            i = row - 1;
            c = 0;
        }

        //Проход по массиву по диагонали от левого края
        int j = 0;
        int i = row / 2;
        int k;
        int m;
        c = 0;
        while(j < (col - 1) / 2){

            if (i > 0){
                i--;
            }
            else{
                j++;
            }
            k = i;
            m = j;
            while (k < row && m < col){
                if (chip == nums[k][m]){
                    c++;
                    if (c == 4){
                        // console.log("ПД");
                        return true;
                    }
                }
                else{
                    c = 0;
                }
                k++;
                m++;
            }
            c = 0;
        }

        //Проход по массиву по диагонали от правого края
        i = row / 2;
        j = col - 1;
        while(j > (col - 1) / 2 ){
            if (i > 0){
                i--;
            }
            else{
                j--;
            }
            k = i;
            m = j;
            while (k < row && m >= 0){
                if (chip == nums[k][m]){
                    c++;
                    if (c == 4){
                        // console.log("ОД");
                        return true;
                    }
                }
                else{
                    c = 0;
                }
                k++;
                m--;
            }
            c = 0;
        }
        return false;
    }


    // Обработать уход игрока из игры
    // Правильно обработать рефреш
    private static final int row = 6;
    private static final int col = 7;
}
