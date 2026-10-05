package com.eduflow.menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface MenuRepository extends JpaRepository<Menu,Long> { List<Menu> findByActiveTrueOrderByDisplayOrderAsc(); }
