package com.eduflow.exam;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.*;
import java.util.*;
@RestController @RequestMapping("/api/exam-papers") @CrossOrigin(origins={"http://localhost:4200", "http://127.0.0.1:4200"}, allowCredentials="true") public class ExamPaperController {
 private final ExamPaperRepository repository; public ExamPaperController(ExamPaperRepository repository){this.repository=repository;}
 @GetMapping public List<ExamPaper> all(){return repository.findAll();}
 @PostMapping public ExamPaper create(@RequestBody ExamPaper paper){paper.status=ExamPaper.Status.PENDING_APPROVAL;return repository.save(paper);}
 @PostMapping("/{id}/approve") public ExamPaper approve(@PathVariable Long id,@RequestParam Long adminId){ExamPaper p=repository.findById(id).orElseThrow();p.status=ExamPaper.Status.APPROVED;p.approvedBy=adminId;p.approvedAt=LocalDateTime.now();return repository.save(p);}
 @GetMapping("/{id}/printable") public ResponseEntity<ExamPaper> printable(@PathVariable Long id){ExamPaper p=repository.findById(id).orElseThrow();if(p.status!=ExamPaper.Status.APPROVED)return ResponseEntity.status(HttpStatus.FORBIDDEN).build();return ResponseEntity.ok(p);}
}
