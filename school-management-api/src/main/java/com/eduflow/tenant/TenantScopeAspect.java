package com.eduflow.tenant;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.Session;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.orm.jpa.EntityManagerFactoryUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import jakarta.persistence.EntityManagerFactory;
import java.lang.reflect.UndeclaredThrowableException;

@Aspect
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantScopeAspect {
    private final EntityManagerFactory entityManagerFactory;
    private final TransactionTemplate transactions;

    public TenantScopeAspect(
            EntityManagerFactory entityManagerFactory,
            PlatformTransactionManager transactionManager) {
        this.entityManagerFactory = entityManagerFactory;
        this.transactions = new TransactionTemplate(transactionManager);
    }

    @Around("execution(public * com.eduflow..*Controller.*(..))")
    public Object scopeControllerCall(ProceedingJoinPoint invocation) throws Throwable {
        Long schoolId = TenantContext.currentSchoolId();
        if (schoolId == null) return invocation.proceed();
        try {
            return transactions.execute(status -> {
                var entityManager = EntityManagerFactoryUtils.getTransactionalEntityManager(entityManagerFactory);
                if (entityManager == null) throw new IllegalStateException("No tenant-scoped EntityManager is bound.");
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("schoolScope").setParameter("schoolId", schoolId);
                try {
                    return invocation.proceed();
                } catch (RuntimeException | Error ex) {
                    throw ex;
                } catch (Throwable ex) {
                    throw new UndeclaredThrowableException(ex);
                }
            });
        } catch (UndeclaredThrowableException ex) {
            throw ex.getUndeclaredThrowable();
        }
    }
}
