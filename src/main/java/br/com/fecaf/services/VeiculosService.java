package br.com.fecaf.services;

import br.com.fecaf.model.Veiculos;
import br.com.fecaf.repository.VeiculosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VeiculosService {

    @Autowired
    private VeiculosRepository VeiculosRepository;

    public List<Veiculos> listarVeiculos() {
        return VeiculosRepository.findAll();
    }

    public Veiculos salvarVeiculos (Veiculos veiculos) {
        return VeiculosRepository.save(veiculos);
    }

    public void deletarVeiculos (int id) {
        VeiculosRepository.deleteById(id);
    }
}
