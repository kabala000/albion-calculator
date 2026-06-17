package DAO;

import Conexion.Conexion;
import Modelo.Item;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ItemDAO {

    private static final List<String> TABLAS_VALIDAS = List.of(
        "Herrero", "Herrero_Magico", "Flechero", "Hojalatero"
    );

    public List<Item> obtenerItemsPorCategoria(String categoria) {
        List<Item> items = new ArrayList<>();

        if (!TABLAS_VALIDAS.contains(categoria)) {
            return items;
        }

        String sql = "SELECT item, tipo_item, url_item, "
                   + "lingotes, tablas, telas, cueros, "
                   + "artefacto_1, cantidad_artefacto_1, url_artefacto_1, "
                   + "artefacto_2, cantidad_artefacto_2, url_artefacto_2 "
                   + "FROM " + categoria;

        try (Connection con = Conexion.getConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                items.add(new Item(
                    rs.getString("item"),
                    rs.getString("tipo_item"),
                    rs.getString("url_item"),
                    rs.getInt("lingotes"),
                    rs.getInt("tablas"),
                    rs.getInt("telas"),
                    rs.getInt("cueros"),
                    rs.getString("artefacto_1"),
                    rs.getInt("cantidad_artefacto_1"),
                    rs.getString("url_artefacto_1"),
                    rs.getString("artefacto_2"),
                    rs.getInt("cantidad_artefacto_2"),
                    rs.getString("url_artefacto_2")
                ));
            }

        } catch (SQLException e) {
            System.out.println("Error consultando " + categoria + ": " + e.getMessage());
        }

        return items;
    }
}