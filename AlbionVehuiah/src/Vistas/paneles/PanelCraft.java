package Vistas.paneles;

/**
 *
 * @author vehuiah
 */


import Conexion.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.ImageIcon;
import java.awt.Image;
import java.net.URL;



public class PanelCraft extends javax.swing.JPanel {

    /**
     * Creates new form PanelCraft
     */
    public PanelCraft() {
        initComponents();
        // Cargar por defecto la primera opción al iniciar el panel
cargarItemsPorCategoria(cbxCategoria.getSelectedItem().toString());
// Carga la imagen del diario correspondiente al tier que esté seleccionado por defecto
    actualizarImagenDiario();
    }
    
    
    
    
    // Pega este método dentro de tu clase PanelCraft
private void cargarItemsPorCategoria(String categoria) {
    // 1. Limpiar el combobox de ítems para que no se acumulen los anteriores
    cbxItem.removeAllItems();
    
    // Si la categoría seleccionada no es Herrero, por ahora salimos hasta tener las otras tablas
    if (!categoria.equals("Herrero")) {
        cbxItem.addItem("Próximamente...");
        return;
    }

    // Consulta SQL para traer el nombre legible de los ítems sin repetir (DISTINCT)
String sql = "SELECT DISTINCT item FROM Herrero";

    // Usamos el bloque try-with-resources para que la conexión de SQLite se cierre sola al terminar
    try (Connection conn = Conexion.conectar();
         PreparedStatement pstmt = conn.prepareStatement(sql);
         ResultSet rs = pstmt.executeQuery()) {

        System.out.println("Cargando ítems de la rama Herrero...");

        // 2. Recorrer los resultados de la base de datos y meterlos al combobox
        while (rs.next()) {
            String nombreItem = rs.getString("item");
            cbxItem.addItem(nombreItem);
        }

    } catch (SQLException e) {
        System.err.println("Error al cargar los ítems desde la base de datos.");
        e.printStackTrace();
    }
}
private void cargarDetalleItem(String nombreItem) {

    String sql = "SELECT * FROM Herrero WHERE item = ?";

    try (Connection conn = Conexion.conectar();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setString(1, nombreItem);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {

            int cantidad = 1;

            try {
                cantidad = Integer.parseInt(txtCantidad.getText().trim());

                if (cantidad <= 0) {
                    cantidad = 1;
                }

            } catch (Exception e) {
                cantidad = 1;
            }

            // ITEM
            lblNombreItem.setText(rs.getString("item"));
            lblCantidadItem.setText(String.valueOf(cantidad));

            // TIPOITEM
            lblTipoItem.setText(rs.getString("tipo_item"));

            
            
            
            
            
            
            // LIMPIAR
            lblNombreMaterial1.setText("");
            lblNombreMaterial2.setText("");
            lblCantidadMaterial1.setText("");
            lblCantidadMaterial2.setText("");
            
            lblTipoItem.setText("");

            lblNombreArtefecto1.setText("");
            lblNombreArtefacto2.setText("");
            lblCantidadArtefacto1.setText("");
            lblCantidadArtefacto2.setText("");

            lblImagenItem.setIcon(null);
            lblImagenArtefacto1.setIcon(null);
            lblImagenArtefacto2.setIcon(null);
            lblImagenMaterial1.setIcon(null);
            lblImagenMaterial2.setIcon(null);
            
             lblTipoItem.setIcon(null);

            // =========================
            // IMAGEN ITEM
            // =========================

            try {

                String itemId = rs.getString("url_item");

                String tier =
                        cbxTier.getSelectedItem().toString();

                String encantamiento =
                        cbxEntantamiento.getSelectedItem().toString();

                String codigoFinal =
                        tier + "_" + itemId;

                if (!encantamiento.equals(".0")) {
                    codigoFinal += "@"
                            + encantamiento.substring(1);
                }

                String url =
                        "https://render.albiononline.com/v1/item/"
                        + codigoFinal
                        + ".png";

                ImageIcon icon =
                        new ImageIcon(new URL(url));

                Image img = icon.getImage().getScaledInstance(64, 64, Image.SCALE_SMOOTH);
                        

                lblImagenItem.setIcon(
                        new ImageIcon(img)
                );

            } catch (Exception ex) {
                ex.printStackTrace();
            }

            // =========================
            // MATERIALES
            // =========================

            int pos = 1;

            if (rs.getInt("lingotes") > 0) {

                lblNombreMaterial1.setText("Lingotes");
                lblCantidadMaterial1.setText(
                        String.valueOf(
                                rs.getInt("lingotes") * cantidad
                        )
                );

                pos++;
            }

            if (rs.getInt("tablas") > 0) {

                if (pos == 1) {
                    lblNombreMaterial1.setText("Tablas");
                    lblCantidadMaterial1.setText(
                            String.valueOf(
                                    rs.getInt("tablas") * cantidad
                            )
                    );
                } else {
                    lblNombreMaterial2.setText("Tablas");
                    lblCantidadMaterial2.setText(
                            String.valueOf(
                                    rs.getInt("tablas") * cantidad
                            )
                    );
                }

                pos++;
            }

            if (rs.getInt("telas") > 0) {

                if (pos == 1) {
                    lblNombreMaterial1.setText("Telas");
                    lblCantidadMaterial1.setText(
                            String.valueOf(
                                    rs.getInt("telas") * cantidad
                            )
                    );
                } else {
                    lblNombreMaterial2.setText("Telas");
                    lblCantidadMaterial2.setText(
                            String.valueOf(
                                    rs.getInt("telas") * cantidad
                            )
                    );
                }

                pos++;
            }

            if (rs.getInt("cueros") > 0) {

                if (pos == 1) {
                    lblNombreMaterial1.setText("Cueros");
                    lblCantidadMaterial1.setText(
                            String.valueOf(
                                    rs.getInt("cueros") * cantidad
                            )
                    );
                } else {
                    lblNombreMaterial2.setText("Cueros");
                    lblCantidadMaterial2.setText(
                            String.valueOf(
                                    rs.getInt("cueros") * cantidad
                            )
                    );
                }
            }
            
            
            // =========================
// IMAGEN MATERIAL 1
// =========================

try {

    String material1 = lblNombreMaterial1.getText();

    if (!material1.isEmpty()) {

        String codigoMaterial = "";

        switch (material1) {

            case "Lingotes":
                codigoMaterial = "METALBAR";
                break;

            case "Tablas":
                codigoMaterial = "PLANKS";
                break;

            case "Telas":
                codigoMaterial = "CLOTH";
                break;

            case "Cueros":
                codigoMaterial = "LEATHER";
                break;
        }

        String tier =
                cbxTier.getSelectedItem().toString();

        String encantamiento =
                cbxEntantamiento.getSelectedItem().toString();

        String codigoFinal =
                tier + "_" + codigoMaterial;

        if (encantamiento.equals(".1")) {
    codigoFinal += "_LEVEL1";
} else if (encantamiento.equals(".2")) {
    codigoFinal += "_LEVEL2";
} else if (encantamiento.equals(".3")) {
    codigoFinal += "_LEVEL3";
} else if (encantamiento.equals(".4")) {
    codigoFinal += "_LEVEL4";
}

        String url =
                "https://render.albiononline.com/v1/item/"
                + codigoFinal
                + ".png";

        ImageIcon icon =
                new ImageIcon(new URL(url));

        Image img =
                icon.getImage().getScaledInstance(
                        lblImagenMaterial1.getWidth(),
                        lblImagenMaterial1.getHeight(),
                        Image.SCALE_SMOOTH
                );

        lblImagenMaterial1.setIcon(
                new ImageIcon(img)
        );

    } else {

        lblImagenMaterial1.setIcon(null);
    }

} catch (Exception ex) {
    ex.printStackTrace();
}

// =========================
// IMAGEN MATERIAL 2
// =========================

try {

    String material2 = lblNombreMaterial2.getText();

    if (!material2.isEmpty()) {

        String codigoMaterial = "";

        switch (material2) {

            case "Lingotes":
                codigoMaterial = "METALBAR";
                break;

            case "Tablas":
                codigoMaterial = "PLANKS";
                break;

            case "Telas":
                codigoMaterial = "CLOTH";
                break;

            case "Cueros":
                codigoMaterial = "LEATHER";
                break;
        }

        String tier =
                cbxTier.getSelectedItem().toString();

        String encantamiento =
                cbxEntantamiento.getSelectedItem().toString();

        String codigoFinal =
                tier + "_" + codigoMaterial;

         if (encantamiento.equals(".1")) {
    codigoFinal += "_LEVEL1";
} else if (encantamiento.equals(".2")) {
    codigoFinal += "_LEVEL2";
} else if (encantamiento.equals(".3")) {
    codigoFinal += "_LEVEL3";
} else if (encantamiento.equals(".4")) {
    codigoFinal += "_LEVEL4";
}

        String url =
                "https://render.albiononline.com/v1/item/"
                + codigoFinal
                + ".png";

        ImageIcon icon =
                new ImageIcon(new URL(url));

        Image img =
                icon.getImage().getScaledInstance(
                        lblImagenMaterial2.getWidth(),
                        lblImagenMaterial2.getHeight(),
                        Image.SCALE_SMOOTH
                );

        lblImagenMaterial2.setIcon(
                new ImageIcon(img)
        );

    } else {

        lblImagenMaterial2.setIcon(null);
    }

} catch (Exception ex) {
    ex.printStackTrace();
}


            // =========================
            // ARTEFACTO 1
            // =========================

            String arte1 = rs.getString("artefacto_1");

            if (arte1 != null
                    && !arte1.trim().isEmpty()
                    && !arte1.equalsIgnoreCase("N/A")) {

                lblNombreArtefecto1.setText(arte1);

                lblCantidadArtefacto1.setText(
                        String.valueOf(
                                rs.getInt("cantidad_artefacto_1") * cantidad
                        )
                );

                try {

                    String codigoArte1 =
                            rs.getString("url_artefacto_1");

                    if (codigoArte1 != null
                            && !codigoArte1.trim().isEmpty()
                            && !codigoArte1.equalsIgnoreCase("N/A")) {

                        String tier =
                                cbxTier.getSelectedItem().toString();

                        String itemArte1 =
                                tier + "_ARTEFACT_" + codigoArte1;

                        String urlArte1 =
                                "https://render.albiononline.com/v1/item/"
                                + itemArte1
                                + ".png";

                        ImageIcon icon =
                                new ImageIcon(new URL(urlArte1));

                        Image img =
                                icon.getImage().getScaledInstance(
                                        lblImagenArtefacto1.getWidth(),
                                        lblImagenArtefacto1.getHeight(),
                                        Image.SCALE_SMOOTH
                                );

                        lblImagenArtefacto1.setIcon(
                                new ImageIcon(img)
                        );
                    }

                } catch (Exception ex) {
                    ex.printStackTrace();
                }

            }

            // =========================
            // ARTEFACTO 2
            // =========================

            String arte2 = rs.getString("artefacto_2");

            if (arte2 != null
                    && !arte2.trim().isEmpty()
                    && !arte2.equalsIgnoreCase("N/A")) {

                lblNombreArtefacto2.setText(arte2);

                lblCantidadArtefacto2.setText(
                        String.valueOf(
                                rs.getInt("cantidad_artefacto_2") * cantidad
                        )
                );

                try {

                    String codigoArte2 =
                            rs.getString("url_artefacto_2");

                    if (codigoArte2 != null
                            && !codigoArte2.trim().isEmpty()
                            && !codigoArte2.equalsIgnoreCase("N/A")) {

                        String tier =
                                cbxTier.getSelectedItem().toString();

                        String itemArte2 =
                                tier + "_ARTEFACT_" + codigoArte2;

                        String urlArte2 =
                                "https://render.albiononline.com/v1/item/"
                                + itemArte2
                                + ".png";

                        ImageIcon icon =
                                new ImageIcon(new URL(urlArte2));

                        Image img =
                                icon.getImage().getScaledInstance(
                                        lblImagenArtefacto2.getWidth(),
                                        lblImagenArtefacto2.getHeight(),
                                        Image.SCALE_SMOOTH
                                );

                        lblImagenArtefacto2.setIcon(
                                new ImageIcon(img)
                        );
                    }

                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }

    } catch (Exception e) {
        e.printStackTrace();
    }
}

private void actualizarImagenDiario() {
    // 1. Validar que tengamos selecciones en ambos ComboBox
    if (cbxTier.getSelectedItem() == null || cbxCategoria.getSelectedItem() == null) {
        return;
    }

    // 2. Obtener los valores seleccionados
    String tier = cbxTier.getSelectedItem().toString().trim(); // Ej: "T4", "T5", "T8"
    String categoria = cbxCategoria.getSelectedItem().toString().trim(); // Ej: "Herrero"

    // 3. Determinar el tipo de diario en inglés según la categoría seleccionada
    String tipoDiario = "";
    switch (categoria) {
        case "Herrero":
            tipoDiario = "WARRIOR";
            break;
        case "Herrero Magico":
            tipoDiario = "MAGE";
            break;
        case "Flechero":
            tipoDiario = "HUNTER";
            break;
        case "Hojalatero":
            tipoDiario = "TOOLMAKER";
            break;
        default:
            tipoDiario = "WARRIOR"; // Por seguridad, un valor por defecto
            break;
    }

    // 4. Construir la URL dinámica combinando el Tier y el Tipo de Diario
    // Ejemplo si es Flechero T8: .../T8_JOURNAL_HUNTER_EMPTY.png?quality=1
    String urlImagen = "https://render.albiononline.com/v1/item/" + tier + "_JOURNAL_" + tipoDiario + "_EMPTY.png?quality=1";

    // 5. Cargar y escalar la imagen desde la API de Internet
    try {
        URL url = new URL(urlImagen);
        ImageIcon iconoOriginal = new ImageIcon(url);
        
        // Verificar si la API devolvió una imagen válida
        if (iconoOriginal.getIconWidth() > 0) {
            Image imgEscalada = iconoOriginal.getImage().getScaledInstance(
                lblImagenLibro.getWidth(), 
                lblImagenLibro.getHeight(), 
                Image.SCALE_SMOOTH
            );
            lblImagenLibro.setIcon(new ImageIcon(imgEscalada));
            lblImagenLibro.setText(""); // Limpiar textos
        } else {
            lblImagenLibro.setIcon(null);
            lblImagenLibro.setText("No disponible");
        }

    } catch (Exception e) {
        System.err.println("Error al conectar con el servidor de imágenes: " + e.getMessage());
        lblImagenLibro.setIcon(null);
        lblImagenLibro.setText("Error Red");
    }
}


private void mostrarTipoItem(String nombreItem) {
    // 🟢 Consulta corregida: busca en la tabla 'herrero' donde la columna 'item' coincida
    String sql = "SELECT tipo_item FROM herrero WHERE item = ?"; 
    
    try (Connection con = Conexion.conectar()) {
        // Si la conexión falla, evitamos que el programa se rompa
        if (con == null) {
            lblTipoItem.setText("Error: Sin conexión");
            return;
        }
        
        try (PreparedStatement pst = con.prepareStatement(sql)) {
            // Inyectamos el ítem seleccionado en el signo de interrogación '?'
            pst.setString(1, nombreItem); 
            
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    // Extraemos el valor de la columna 'tipo_item'
                    String tipo = rs.getString("tipo_item");
                    
                    // Lo mostramos en tu JLabel y limpiamos cualquier ícono previo
                    lblTipoItem.setIcon(null);
                    lblTipoItem.setText(tipo);
                } else {
                    // Por si el ítem está en el combo pero no en la base de datos
                    lblTipoItem.setText("No encontrado");
                }
            }
        }
        
        // Forzamos a la interfaz gráfica a repintar el JLabel con el nuevo texto
        lblTipoItem.revalidate();
        lblTipoItem.repaint();
        
    } catch (SQLException e) {
        System.err.println("Error SQL: " + e.getMessage());
        lblTipoItem.setText("Error BD");
    }
}

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lblTituloRefinado = new javax.swing.JLabel();
        PanelConfig = new javax.swing.JPanel();
        lblCategoria = new javax.swing.JLabel();
        cbxCategoria = new javax.swing.JComboBox<>();
        lblItem = new javax.swing.JLabel();
        cbxItem = new javax.swing.JComboBox<>();
        lblTier = new javax.swing.JLabel();
        cbxTier = new javax.swing.JComboBox<>();
        lblCantidad = new javax.swing.JLabel();
        cbxEntantamiento = new javax.swing.JComboBox<>();
        lblEncantamiento = new javax.swing.JLabel();
        txtCantidad = new javax.swing.JTextField();
        chbBonoActividad = new javax.swing.JCheckBox();
        chbBonoCiudad = new javax.swing.JCheckBox();
        chbFoco = new javax.swing.JCheckBox();
        chbBonoHo = new javax.swing.JCheckBox();
        txtBonoHo = new javax.swing.JTextField();
        btnAñadirACola = new javax.swing.JButton();
        chbLlenarLibros = new javax.swing.JCheckBox();
        PanelItem = new javax.swing.JPanel();
        lblNombreItem = new javax.swing.JLabel();
        lblImagenMaterial2 = new javax.swing.JLabel();
        lblImagenMaterial1 = new javax.swing.JLabel();
        lblImagenArtefacto1 = new javax.swing.JLabel();
        lblImagenArtefacto2 = new javax.swing.JLabel();
        lblCantidadMaterial1 = new javax.swing.JLabel();
        lblCantidadMaterial2 = new javax.swing.JLabel();
        lblCantidadArtefacto1 = new javax.swing.JLabel();
        lblCantidadItem = new javax.swing.JLabel();
        lblImagenItem = new javax.swing.JLabel();
        lblCantidadArtefacto2 = new javax.swing.JLabel();
        lblNombreMaterial1 = new javax.swing.JLabel();
        lblNombreMaterial2 = new javax.swing.JLabel();
        lblNombreArtefecto1 = new javax.swing.JLabel();
        lblNombreArtefacto2 = new javax.swing.JLabel();
        lblTipoItem = new javax.swing.JLabel();
        Panelinf = new javax.swing.JPanel();
        PanelLibros1 = new javax.swing.JPanel();
        PanelMaterialCompra = new javax.swing.JPanel();
        PanelLymhurst = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        PanelFortSterling = new javax.swing.JPanel();
        jLabel6 = new javax.swing.JLabel();
        jLabel44 = new javax.swing.JLabel();
        jLabel45 = new javax.swing.JLabel();
        jLabel46 = new javax.swing.JLabel();
        jLabel47 = new javax.swing.JLabel();
        PanelMartlock = new javax.swing.JPanel();
        jLabel11 = new javax.swing.JLabel();
        jLabel48 = new javax.swing.JLabel();
        jLabel49 = new javax.swing.JLabel();
        jLabel50 = new javax.swing.JLabel();
        jLabel51 = new javax.swing.JLabel();
        PanelThetford = new javax.swing.JPanel();
        jLabel16 = new javax.swing.JLabel();
        jLabel52 = new javax.swing.JLabel();
        jLabel53 = new javax.swing.JLabel();
        jLabel54 = new javax.swing.JLabel();
        jLabel55 = new javax.swing.JLabel();
        PanelBridgewatch = new javax.swing.JPanel();
        jLabel21 = new javax.swing.JLabel();
        jLabel56 = new javax.swing.JLabel();
        jLabel57 = new javax.swing.JLabel();
        jLabel58 = new javax.swing.JLabel();
        jLabel59 = new javax.swing.JLabel();
        PanelCaerleon = new javax.swing.JPanel();
        jLabel26 = new javax.swing.JLabel();
        jLabel60 = new javax.swing.JLabel();
        jLabel61 = new javax.swing.JLabel();
        jLabel62 = new javax.swing.JLabel();
        jLabel63 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        PanelLibros = new javax.swing.JPanel();
        PanelLibros3 = new javax.swing.JPanel();
        lblImagenLibro = new javax.swing.JLabel();
        jLabel37 = new javax.swing.JLabel();
        jLabel43 = new javax.swing.JLabel();
        jLabel69 = new javax.swing.JLabel();
        jLabel42 = new javax.swing.JLabel();
        lblLogo = new javax.swing.JLabel();

        setBackground(new java.awt.Color(37, 43, 51));
        setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblTituloRefinado.setForeground(new java.awt.Color(200, 155, 60));
        lblTituloRefinado.setText("Craft");
        add(lblTituloRefinado, new org.netbeans.lib.awtextra.AbsoluteConstraints(70, 0, -1, -1));

        PanelConfig.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblCategoria.setText("Categotia");
        PanelConfig.add(lblCategoria, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 50, -1, -1));

        cbxCategoria.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Herrero", "Herrero Magico", "Flechero", "Hojalatero" }));
        cbxCategoria.addActionListener(this::cbxCategoriaActionPerformed);
        PanelConfig.add(cbxCategoria, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 50, 180, -1));

        lblItem.setText("Item");
        PanelConfig.add(lblItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 80, -1, -1));

        cbxItem.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        cbxItem.addActionListener(this::cbxItemActionPerformed);
        PanelConfig.add(cbxItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 80, 180, -1));

        lblTier.setText("Tier");
        PanelConfig.add(lblTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 110, 110, 20));

        cbxTier.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "T4", "T5", "T6", "T7", "T8" }));
        cbxTier.addActionListener(this::cbxTierActionPerformed);
        PanelConfig.add(cbxTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 110, 180, -1));

        lblCantidad.setText("Cantidad");
        PanelConfig.add(lblCantidad, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 170, -1, -1));

        cbxEntantamiento.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { ".0", ".1", ".2", ".3", ".4" }));
        PanelConfig.add(cbxEntantamiento, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 140, 180, -1));

        lblEncantamiento.setText("Encantamiento");
        PanelConfig.add(lblEncantamiento, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, -1, -1));

        txtCantidad.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        txtCantidad.setText("0");
        txtCantidad.addActionListener(this::txtCantidadActionPerformed);
        PanelConfig.add(txtCantidad, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 170, 180, -1));

        chbBonoActividad.setText("Bonos de Actividad");
        chbBonoActividad.addActionListener(this::chbBonoActividadActionPerformed);
        PanelConfig.add(chbBonoActividad, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 240, -1, -1));

        chbBonoCiudad.setText("Bono de Ciudad");
        PanelConfig.add(chbBonoCiudad, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 270, -1, -1));

        chbFoco.setText("Foco");
        PanelConfig.add(chbFoco, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 300, -1, -1));

        chbBonoHo.setText("Bono de HO");
        PanelConfig.add(chbBonoHo, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 330, -1, -1));

        txtBonoHo.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        txtBonoHo.setText("0");
        PanelConfig.add(txtBonoHo, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 330, 90, -1));

        btnAñadirACola.setBackground(new java.awt.Color(52, 86, 132));
        btnAñadirACola.setForeground(new java.awt.Color(255, 255, 255));
        btnAñadirACola.setText("Añadir");
        btnAñadirACola.addActionListener(this::btnAñadirAColaActionPerformed);
        PanelConfig.add(btnAñadirACola, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 680, -1, -1));

        chbLlenarLibros.setText("Llenar Libros");
        PanelConfig.add(chbLlenarLibros, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 470, -1, -1));

        add(PanelConfig, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 155, 310, 720));

        PanelItem.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        lblNombreItem.setText("Nombre");
        PanelItem.add(lblNombreItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 10, 110, 30));

        lblImagenMaterial2.setText("Material2");
        PanelItem.add(lblImagenMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(120, 160, 90, 70));

        lblImagenMaterial1.setText("Material1");
        PanelItem.add(lblImagenMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 170, 90, 70));

        lblImagenArtefacto1.setText("Art1");
        PanelItem.add(lblImagenArtefacto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 160, 90, 70));

        lblImagenArtefacto2.setText("Art2");
        PanelItem.add(lblImagenArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(320, 160, 90, 70));

        lblCantidadMaterial1.setText("Cant");
        PanelItem.add(lblCantidadMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 260, -1, -1));

        lblCantidadMaterial2.setText("Cant");
        PanelItem.add(lblCantidadMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 260, -1, -1));

        lblCantidadArtefacto1.setText("Cant");
        PanelItem.add(lblCantidadArtefacto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 260, -1, -1));

        lblCantidadItem.setText("CantidadItem");
        PanelItem.add(lblCantidadItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 40, -1, -1));

        lblImagenItem.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblImagenItem.setText("Item");
        PanelItem.add(lblImagenItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 20, 150, 150));

        lblCantidadArtefacto2.setText("Cant");
        PanelItem.add(lblCantidadArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(320, 250, -1, -1));

        lblNombreMaterial1.setText("nombre");
        PanelItem.add(lblNombreMaterial1, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 240, 80, 20));

        lblNombreMaterial2.setText("nombre");
        PanelItem.add(lblNombreMaterial2, new org.netbeans.lib.awtextra.AbsoluteConstraints(110, 230, 80, 20));

        lblNombreArtefecto1.setText("nombre");
        PanelItem.add(lblNombreArtefecto1, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 230, -1, -1));

        lblNombreArtefacto2.setText("jLabel9");
        PanelItem.add(lblNombreArtefacto2, new org.netbeans.lib.awtextra.AbsoluteConstraints(380, 220, -1, -1));

        lblTipoItem.setText("Tipo de Item");
        PanelItem.add(lblTipoItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 60, 150, 40));

        add(PanelItem, new org.netbeans.lib.awtextra.AbsoluteConstraints(380, 190, 480, 300));

        Panelinf.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        PanelLibros1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());
        Panelinf.add(PanelLibros1, new org.netbeans.lib.awtextra.AbsoluteConstraints(350, 510, 230, 370));

        add(Panelinf, new org.netbeans.lib.awtextra.AbsoluteConstraints(640, 510, 230, 370));

        PanelMaterialCompra.setBackground(new java.awt.Color(47, 54, 64));
        PanelMaterialCompra.setLayout(new java.awt.GridLayout(3, 2, 20, 20));

        PanelLymhurst.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel1.setText("logo");
        PanelLymhurst.add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel2.setText("Material1");
        PanelLymhurst.add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel3.setText("Material2");
        PanelLymhurst.add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel4.setText("Art1");
        PanelLymhurst.add(jLabel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel5.setText("Art2");
        PanelLymhurst.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelLymhurst);

        PanelFortSterling.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel6.setText("logo");
        PanelFortSterling.add(jLabel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel44.setText("Material1");
        PanelFortSterling.add(jLabel44, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel45.setText("Material2");
        PanelFortSterling.add(jLabel45, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel46.setText("Art1");
        PanelFortSterling.add(jLabel46, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel47.setText("Art2");
        PanelFortSterling.add(jLabel47, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelFortSterling);

        PanelMartlock.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel11.setText("logo");
        PanelMartlock.add(jLabel11, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel48.setText("Material1");
        PanelMartlock.add(jLabel48, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel49.setText("Material2");
        PanelMartlock.add(jLabel49, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel50.setText("Art1");
        PanelMartlock.add(jLabel50, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel51.setText("Art2");
        PanelMartlock.add(jLabel51, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelMartlock);

        PanelThetford.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel16.setText("logo");
        PanelThetford.add(jLabel16, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel52.setText("Material1");
        PanelThetford.add(jLabel52, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel53.setText("Material2");
        PanelThetford.add(jLabel53, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel54.setText("Art1");
        PanelThetford.add(jLabel54, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel55.setText("Art2");
        PanelThetford.add(jLabel55, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelThetford);

        PanelBridgewatch.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel21.setText("logo");
        PanelBridgewatch.add(jLabel21, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel56.setText("Material1");
        PanelBridgewatch.add(jLabel56, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel57.setText("Material2");
        PanelBridgewatch.add(jLabel57, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel58.setText("Art1");
        PanelBridgewatch.add(jLabel58, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel59.setText("Art2");
        PanelBridgewatch.add(jLabel59, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelBridgewatch);

        PanelCaerleon.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel26.setText("logo");
        PanelCaerleon.add(jLabel26, new org.netbeans.lib.awtextra.AbsoluteConstraints(62, 15, 120, 120));

        jLabel60.setText("Material1");
        PanelCaerleon.add(jLabel60, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 225, 20));

        jLabel61.setText("Material2");
        PanelCaerleon.add(jLabel61, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 165, 215, 15));

        jLabel62.setText("Art1");
        PanelCaerleon.add(jLabel62, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 185, 215, 15));

        jLabel63.setText("Art2");
        PanelCaerleon.add(jLabel63, new org.netbeans.lib.awtextra.AbsoluteConstraints(15, 205, 215, 15));

        PanelMaterialCompra.add(PanelCaerleon);

        add(PanelMaterialCompra, new org.netbeans.lib.awtextra.AbsoluteConstraints(900, 100, 430, 790));

        jLabel7.setForeground(new java.awt.Color(220, 220, 220));
        jLabel7.setText("Mejor Ciudad Materiales");
        add(jLabel7, new org.netbeans.lib.awtextra.AbsoluteConstraints(1030, 70, -1, -1));

        jLabel8.setForeground(new java.awt.Color(220, 220, 220));
        jLabel8.setText("Configuracion");
        add(jLabel8, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 130, -1, -1));

        PanelLibros.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        PanelLibros3.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());
        PanelLibros.add(PanelLibros3, new org.netbeans.lib.awtextra.AbsoluteConstraints(350, 510, 230, 370));

        lblImagenLibro.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblImagenLibro.setText("Item");
        PanelLibros.add(lblImagenLibro, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 10, 150, 130));

        jLabel37.setText("Cantidad de libros vacios ");
        PanelLibros.add(jLabel37, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 220, -1, -1));

        jLabel43.setText("Fama Unidad");
        PanelLibros.add(jLabel43, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 160, -1, -1));

        jLabel69.setText("Fama Total");
        PanelLibros.add(jLabel69, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 180, -1, -1));

        jLabel42.setText("Cantidad de libros llenos ");
        PanelLibros.add(jLabel42, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 200, -1, -1));

        add(PanelLibros, new org.netbeans.lib.awtextra.AbsoluteConstraints(360, 560, 250, 260));

        lblLogo.setBackground(new java.awt.Color(200, 155, 60));
        lblLogo.setForeground(new java.awt.Color(200, 155, 60));
        lblLogo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblLogo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagenes/logo.png"))); // NOI18N
        lblLogo.setText("ALBION VEHUIAH");
        add(lblLogo, new org.netbeans.lib.awtextra.AbsoluteConstraints(460, 50, 350, 100));
    }// </editor-fold>//GEN-END:initComponents

    private void txtCantidadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtCantidadActionPerformed
       // TODO add your handling code here:
    }//GEN-LAST:event_txtCantidadActionPerformed

    private void chbBonoActividadActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_chbBonoActividadActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_chbBonoActividadActionPerformed

    private void btnAñadirAColaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAñadirAColaActionPerformed
    String Nombre = lblNombreItem.getText();
    String Cantidad = lblCantidadItem.getText();
    // TODO add your handling code here:
    }//GEN-LAST:event_btnAñadirAColaActionPerformed

    private void cbxCategoriaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxCategoriaActionPerformed
   // Obtener el texto de la categoría seleccionada por el usuario
    String categoriaSeleccionada = cbxCategoria.getSelectedItem().toString();
    
    // Si la categoría no está vacía, disparamos la carga
    if (categoriaSeleccionada != null && !categoriaSeleccionada.isEmpty()) {
        cargarItemsPorCategoria(categoriaSeleccionada);
    }
    actualizarImagenDiario();// TODO add your handling code here:
    }//GEN-LAST:event_cbxCategoriaActionPerformed

    private void cbxItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxItemActionPerformed
Object seleccionado = cbxItem.getSelectedItem();
// Validamos que el usuario realmente haya seleccionado algo
    if (cbxItem.getSelectedItem() != null) {
        String itemSeleccionado = cbxItem.getSelectedItem().toString();
        
        // Llamamos al método pasándole el ítem seleccionado (ej. "Botas de Guardian")
        mostrarTipoItem(itemSeleccionado);
    }
    }//GEN-LAST:event_cbxItemActionPerformed

    private void cbxTierActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxTierActionPerformed
// Cada vez que cambie el Tier, actualizamos la imagen del libro diario
    actualizarImagenDiario();       
    }//GEN-LAST:event_cbxTierActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelBridgewatch;
    private javax.swing.JPanel PanelCaerleon;
    private javax.swing.JPanel PanelConfig;
    private javax.swing.JPanel PanelFortSterling;
    private javax.swing.JPanel PanelItem;
    private javax.swing.JPanel PanelLibros;
    private javax.swing.JPanel PanelLibros1;
    private javax.swing.JPanel PanelLibros3;
    private javax.swing.JPanel PanelLymhurst;
    private javax.swing.JPanel PanelMartlock;
    private javax.swing.JPanel PanelMaterialCompra;
    private javax.swing.JPanel PanelThetford;
    private javax.swing.JPanel Panelinf;
    private javax.swing.JButton btnAñadirACola;
    private javax.swing.JComboBox<String> cbxCategoria;
    private javax.swing.JComboBox<String> cbxEntantamiento;
    private javax.swing.JComboBox<String> cbxItem;
    private javax.swing.JComboBox<String> cbxTier;
    private javax.swing.JCheckBox chbBonoActividad;
    private javax.swing.JCheckBox chbBonoCiudad;
    private javax.swing.JCheckBox chbBonoHo;
    private javax.swing.JCheckBox chbFoco;
    private javax.swing.JCheckBox chbLlenarLibros;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel37;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel42;
    private javax.swing.JLabel jLabel43;
    private javax.swing.JLabel jLabel44;
    private javax.swing.JLabel jLabel45;
    private javax.swing.JLabel jLabel46;
    private javax.swing.JLabel jLabel47;
    private javax.swing.JLabel jLabel48;
    private javax.swing.JLabel jLabel49;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel50;
    private javax.swing.JLabel jLabel51;
    private javax.swing.JLabel jLabel52;
    private javax.swing.JLabel jLabel53;
    private javax.swing.JLabel jLabel54;
    private javax.swing.JLabel jLabel55;
    private javax.swing.JLabel jLabel56;
    private javax.swing.JLabel jLabel57;
    private javax.swing.JLabel jLabel58;
    private javax.swing.JLabel jLabel59;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel60;
    private javax.swing.JLabel jLabel61;
    private javax.swing.JLabel jLabel62;
    private javax.swing.JLabel jLabel63;
    private javax.swing.JLabel jLabel69;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel lblCantidad;
    private javax.swing.JLabel lblCantidadArtefacto1;
    private javax.swing.JLabel lblCantidadArtefacto2;
    private javax.swing.JLabel lblCantidadItem;
    private javax.swing.JLabel lblCantidadMaterial1;
    private javax.swing.JLabel lblCantidadMaterial2;
    private javax.swing.JLabel lblCategoria;
    private javax.swing.JLabel lblEncantamiento;
    private javax.swing.JLabel lblImagenArtefacto1;
    private javax.swing.JLabel lblImagenArtefacto2;
    private javax.swing.JLabel lblImagenItem;
    private javax.swing.JLabel lblImagenLibro;
    private javax.swing.JLabel lblImagenMaterial1;
    private javax.swing.JLabel lblImagenMaterial2;
    private javax.swing.JLabel lblItem;
    private javax.swing.JLabel lblLogo;
    private javax.swing.JLabel lblNombreArtefacto2;
    private javax.swing.JLabel lblNombreArtefecto1;
    private javax.swing.JLabel lblNombreItem;
    private javax.swing.JLabel lblNombreMaterial1;
    private javax.swing.JLabel lblNombreMaterial2;
    private javax.swing.JLabel lblTier;
    private javax.swing.JLabel lblTipoItem;
    private javax.swing.JLabel lblTituloRefinado;
    private javax.swing.JTextField txtBonoHo;
    private javax.swing.JTextField txtCantidad;
    // End of variables declaration//GEN-END:variables
}
