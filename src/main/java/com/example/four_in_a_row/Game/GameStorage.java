package com.example.four_in_a_row.Game;

//Зачем?
import java.util.HashMap;
import java.util.Map;

public class GameStorage {
    private static Map<String, Game> games;
    private static GameStorage instance;

    private GameStorage(){
        games = new HashMap<>();
    }

    public static synchronized GameStorage getInstance(){
        if (instance == null){
            instance = new GameStorage();
        }
        return new GameStorage();
    }

    public Map<String, Game> getGames(){
        return games;
    }

    public void setGames(Game game){
        games.put(game.getId(), game);
    }

}
