package br.com.fecaf.repository;

import br.com.fecaf.model.Veiculos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculosRepository extends JpaRepository<Veiculos, Integer> {
}
