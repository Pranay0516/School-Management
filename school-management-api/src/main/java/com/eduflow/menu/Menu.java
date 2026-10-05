package com.eduflow.menu;
import jakarta.persistence.*;
import java.util.*;
@Entity @Table(name="menus") public class Menu {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String title; public String route; public String icon; public Integer displayOrder=0; public boolean active=true;
 @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="menu_roles",joinColumns=@JoinColumn(name="menu_id")) @Column(name="role_name") public Set<String> roles=new HashSet<>();
}
