package com.example.four_in_a_row.Game.DTO;


import lombok.Data;

import java.lang.reflect.Array;
import java.util.ArrayList;

@Data
public class LastChanges {
    private String gameId;
    private int playerNum;
    private ArrayList<int[]> coordinates;
}