package com.example.four_in_a_row.Game;

import lombok.Data;
@Data
public class Game {

    private String id;
    private Player player1;
    private Player player2;
    private GameStatus status;
    //Если что подредактировать
    private int[][] field;
    private int winner;
    private boolean winFlag;
    private int currentPlayer;
    //Подумать как заполнить board заранее
}

