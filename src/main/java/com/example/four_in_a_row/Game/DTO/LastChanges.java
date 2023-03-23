package com.example.four_in_a_row.Game.DTO;


import lombok.Data;

import java.lang.reflect.Array;
import java.util.ArrayList;

@Data
public class LastChanges {
    // TODO: Убрать gameId так как он всё равно как путь передаётся
    private String gameId;
    private int playerNum;
    private ArrayList<Integer> coordinates;
}