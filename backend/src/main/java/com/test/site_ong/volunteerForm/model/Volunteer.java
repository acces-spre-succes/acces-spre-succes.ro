package com.test.site_ong.volunteerForm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "volunteers")
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "First name is required")
    @Size(min = 2, message = "First name should have at least 2 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, message = "Last name should have at least 2 characters")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull(message = "Age is required")
    @Min(value = 14, message = "Volunteer must be at least 14 years old")
    @Max(value = 110, message = "Invalid age, please enter a valid one")
    @Column(name = "age", nullable = false)
    private Integer age;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 16, message = "Phone number shouldn't exceed 16 characters")
    @Column(name = "phoneNumber", nullable = false, unique = true)
    private String phoneNumber;

    @Size(max = 400)
    @Column(name = "description")
    private String description;


    public String getFullName() {
        return firstName + " " + lastName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    //a status could be added, to be discussed

}
