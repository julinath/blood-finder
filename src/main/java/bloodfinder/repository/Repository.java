package bloodfinder.repository;

import java.util.List;

/**
 * Generic Repository Interface — Abstraction + Generics
 * All repositories implement this contract.
 */
public interface Repository<T> {
    boolean save(T entity);
    T findById(int id);
    List<T> findAll();
    boolean update(T entity);
    boolean delete(int id);
}
