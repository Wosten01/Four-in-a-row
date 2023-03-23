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

    public void nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1 < 3) ? ++this.currentPlayer : 1;
    }
    //Подумать как заполнить board заранее
}

