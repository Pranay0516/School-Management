package com.eduflow.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transport_vehicles")
public class TransportVehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String vehicleNumber;
    public String route;
    public String driverName;
    public int studentCount;

    @Enumerated(EnumType.STRING)
    public Status status = Status.IDLE;

    public enum Status { ON_TRIP, IDLE, OFFLINE }
}
