package Conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    
    // Al estar el archivo database.db en la raíz del proyecto, la ruta es directa
    private static final String URL = "jdbc:sqlite:database.db";
    
    /**
     * Método estático para obtener la conexión con la base de datos.
     * @return Connection objeto de conexión listo para usar, o null si falla.
     */
    public static Connection conectar() {
        Connection conn = null;
        try {
            // Registrar el Driver de SQLite que importamos con el archivo .jar
            Class.forName("org.sqlite.JDBC");
            
            // Establecer y retornar la conexión
            conn = DriverManager.getConnection(URL);
            
        } catch (ClassNotFoundException e) {
            System.err.println("Error: No se encontró el conector de SQLite (.jar).");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Error al conectar con la base de datos database.db.");
            e.printStackTrace();
        }
        return conn;
    }
}