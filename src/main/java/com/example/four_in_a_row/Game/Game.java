package com.example.four_in_a_row.Game;

import lombok.Data;

import java.util.ArrayList;
@Data
public class Game {

    private String id;
    private Player player1;
    private Player player2;
    private GameStatus status;
    //Если что подредактировать
    private int[][] field;
    private boolean winFlag;
    //Подумать как заполнить board заранее
}

