package com.example.four_in_a_row.studenttest;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

//@Component
@Service
public class StudentService {
    public List<Student> getStudents(){
        return List.of(
                new Student(
                        11L,
                        "Vlad",
                        "@mail",
                        LocalDate.of(2000, Month.APRIL, 5),
                        21
                )
        );
    }
}
