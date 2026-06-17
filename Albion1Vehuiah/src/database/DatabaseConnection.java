package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;

public class DatabaseConnection {

    private static final String URL = "jdbc:sqlite:database.db";

    public static Connection conectar() {
        try {
            return DriverManager.getConnection(URL);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void listarTablas() {
        try (
            Connection conn = conectar();
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(
                "SELECT name FROM sqlite_master WHERE type='table'"
            )
        ) {
            while (rs.next()) {
                System.out.println(rs.getString("name"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void mostrarColumnasHerrero() {
        try (
            Connection conn = conectar();
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM Herrero LIMIT 1")
        ) {

            ResultSetMetaData md = rs.getMetaData();

            for (int i = 1; i <= md.getColumnCount(); i++) {
                System.out.println(md.getColumnName(i));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void mostrarPrimerosItems() {
        try (
            Connection conn = conectar();
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(
                "SELECT item FROM Herrero ORDER BY id LIMIT 10"
            )
        ) {

            while (rs.next()) {
                System.out.println(rs.getString("item"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static ArrayList<String> obtenerItemsHerrero() {

        ArrayList<String> items = new ArrayList<>();

        try (
            Connection conn = conectar();
            PreparedStatement ps = conn.prepareStatement(
                "SELECT item FROM Herrero ORDER BY id"
            );
            ResultSet rs = ps.executeQuery()
        ) {

            while (rs.next()) {
                items.add(rs.getString("item"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return items;
    }

    public static ItemData obtenerItem(String nombreItem) {

        ItemData data = null;

        try (
            Connection conn = conectar();
            PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM Herrero WHERE item = ?"
            )
        ) {

            ps.setString(1, nombreItem);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {

                    data = new ItemData();

                    data.item = rs.getString("item");
                    data.tipoItem = rs.getString("tipo_item");

                    data.lingotes = rs.getInt("lingotes");
                    data.tablas = rs.getInt("tablas");
                    data.telas = rs.getInt("telas");
                    data.cueros = rs.getInt("cueros");

                    data.artefacto1 = rs.getString("artefacto_1");
                    data.cantidadArtefacto1 = rs.getInt("cantidad_artefacto_1");

                    data.artefacto2 = rs.getString("artefacto_2");
                    data.cantidadArtefacto2 = rs.getInt("cantidad_artefacto_2");

                    // ✔ URLs de artefactos (ESTO TE FALTABA)
                    data.url_artefacto_1 = rs.getString("url_artefacto_1");
                    data.url_artefacto_2 = rs.getString("url_artefacto_2");

                    // URL del item principal
                    data.setUrl_item(rs.getString("url_item"));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return data;
    }
}