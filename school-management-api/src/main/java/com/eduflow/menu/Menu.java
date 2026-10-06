package com.eduflow.menu;
import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import java.util.*;
@Entity @Table(name="menus") @Filter(name = "schoolScope", condition = "school_id = :schoolId") public class Menu extends SchoolScopedEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String title; public String route; public String icon; public String category; public Integer displayOrder=0; public boolean active=true;
 @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="menu_roles",joinColumns=@JoinColumn(name="menu_id")) @Column(name="role_name") public Set<String> roles=new HashSet<>();
}
