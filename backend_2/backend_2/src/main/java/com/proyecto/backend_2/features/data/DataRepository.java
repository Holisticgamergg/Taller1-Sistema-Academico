package com.proyecto.backend_2.features.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.backend_2.ids.DataId;

import jakarta.transaction.Transactional;

public interface DataRepository extends JpaRepository<DataModel, DataId> {
    @Transactional
    @Modifying
    @Query(value = "insert into datos(id, cedula) values(:id, :cedula)", nativeQuery = true)
    int insertCedula(@Param("id") Integer id, @Param("cedula") String cedula);

    @Modifying
    @Query(value = "update datos set cedula = :cedula where codp = :codp", nativeQuery = true)
    void updateCedula(@Param("codp") Integer codp, @Param("cedula") String cedula);

    @Modifying
    @Transactional
    @Query(value = "delete from datos where codp = :codp", nativeQuery = true)
    void deleteByCodp(@Param("codp") Integer codp);
}
