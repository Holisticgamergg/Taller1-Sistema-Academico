package com.proyecto.backend_2.features.menus;

import java.util.List;
import org.springframework.http.ResponseEntity; // <-- Importante
import org.springframework.web.bind.annotation.*; // <-- Importa todo
import lombok.RequiredArgsConstructor;

// (Ya no necesitas MenuDto aquí, así que puedes quitar el import)
// import com.proyecto.backend_2.dtos.MenuDto; 

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService service; // <-- Llama al servicio que ya corregimos

    /**
     * Endpoint para OBTENER la lista filtrada (Pantalla B-6)
     * Llama a service.get() que SÍ acepta filtros.
     * Ej: GET /api/menus?nombre=Admin&estado=1
     */
    @GetMapping
    public List<MenuModel> getAllMenus(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Integer estado) {
        return service.get(nombre, estado);
    }

    /**
     * Endpoint para OBTENER un solo Menú (para modal B-6.2)
     * Ej: GET /api/menus/1
     */
    @GetMapping("/{codm}")
    public MenuModel getMenuById(@PathVariable Integer codm) {
        return service.getById(codm); // Llama al nuevo método getById
    }

    /**
     * Endpoint para CREAR un nuevo Menú (B-6.1)
     * Ej: POST /api/menus
     */
    @PostMapping
    public MenuModel saveMenu(@RequestBody MenuModel menu) {
        return service.post(menu); // Llama al service.post()
    }

    /**
     * Endpoint para ACTUALIZAR un Menú (B-6.2)
     * Ej: PUT /api/menus/1
     */
    @PutMapping("/{codm}")
    public MenuModel updateMenu(@PathVariable Integer codm, @RequestBody MenuModel menu) {
        return service.put(codm, menu); // Llama al service.put()
    }

    /**
     * Endpoint para ELIMINAR un Menú (B-6.3 - Baja Lógica)
     * Ej: DELETE /api/menus/1
     */
    @DeleteMapping("/{codm}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Integer codm) {
        service.changeState(codm, 0); // 0 = Baja
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para HABILITAR un Menú (B-6.4)
     * Ej: POST /api/menus/1/habilitar
     */
    @PostMapping("/{codm}/habilitar")
    public ResponseEntity<Void> enableMenu(@PathVariable Integer codm) {
        service.changeState(codm, 1); // 1 = Activo
        return ResponseEntity.ok().build();
    }
}