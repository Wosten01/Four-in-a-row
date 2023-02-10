package com.example.four_in_a_row.Exceptions;

public class InvalidParamException extends Exception{
    private String message;

    public InvalidParamException(String message){
        this.message = message;
    }

    public String getMessage(){
        return this.message;
        //Нужна ли this
    }
}
