package com.example.four_in_a_row.Exceptions;

public class InvalidGameException extends Exception {
    private String message;

    public InvalidGameException(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
        //Нужна ли this
    }
}
