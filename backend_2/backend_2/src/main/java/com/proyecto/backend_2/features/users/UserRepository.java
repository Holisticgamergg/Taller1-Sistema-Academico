package com.proyecto.backend_2.features.users;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.backend_2.features.personals.PersonalModel;
import com.proyecto.backend_2.features.roles.RolModel;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, String> {
    // Encontrar al usuario por su login
    Optional<UserModel> findByLogin(String login);

    // Query para enlazar el usuario a la persona al momento del registro
    @Transactional
    @Modifying
    @Query(value = "update usuarios set codp = :xcodp where login = :xlogin", nativeQuery = true)
    void changeCodp(@Param("xcodp") Integer xcodp, @Param("xlogin") String xlogin);

    // Query para extraer los roles del usuario
    @Query(value = "select r.* from usuarios u join usurol us on us.login = u.login" +
            " join roles r on r.codr = us.codr where us.login = :xlogin and r.estado = 1", nativeQuery = true)
    List<RolModel> getRolesUsuario(@Param("xlogin") String xlogin);

    // Query para obtener la persona
    @Query(value = "select p.* from usuarios u join personal p on p.codp = u.codp where u.login = :xlogin", nativeQuery = true)
    PersonalModel getPersonaUsuario(@Param("xlogin") String xlogin);
}
