package com.example.four_in_a_row.Controllers;

import com.example.four_in_a_row.Game.Player;
import lombok.Data;

@Data
public class ConnectRequest {
    private Player player;
    private String gameId;
}
