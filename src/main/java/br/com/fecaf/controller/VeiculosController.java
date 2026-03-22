package br.com.fecaf.controller;

import br.com.fecaf.model.Veiculos;
import br.com.fecaf.services.VeiculosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")

public class VeiculosController {

    @Autowired
    private VeiculosService veiculosService;

    @GetMapping("/listarVeiculos")
    public List<Veiculos> litarVeiculos() {
        return veiculosService.listarVeiculos();
    }

    @PostMapping("/cadastrarVeiculos")
    public ResponseEntity<Veiculos> salvarVeiculos(@RequestBody Veiculos veiculos) {
        Veiculos newVeiculos = veiculosService.salvarVeiculos(veiculos);
        return ResponseEntity.status(HttpStatus.CREATED).body(newVeiculos);
    }

    @DeleteMapping("/deletarVeiculos/{id}")
    public ResponseEntity<Void> deletarVeiculos (@PathVariable int id) {
        veiculosService.deletarVeiculos(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();

    }

    @PutMapping("/editarVeiculos/{id}")
    public Veiculos editar(@PathVariable int id, @RequestBody Veiculos v) {
        v.setId(id);
        return veiculosService.salvarVeiculos(v);
    }

}
