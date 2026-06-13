
package Vistas.paneles;

/**
 * @author vehuiah
 */
public class PanelConfiguracion extends javax.swing.JPanel {


    // ==========================================
    // VARIABLES GLOBALES Y MATRICES DE MEMORIA
    // ==========================================
    // Estructura: [Material][Ciudad][Fila de las 25] = Valor
    // Materiales: 0=Wood, 1=Bar, 2=Cloth, 3=Hide, 4=Stone
    // Ciudades: 0=Martlock, 1=Lymhurst, 2=FortSterling, 3=Bridgewatch, 4=Thetford
    private final int[][][] matrizPreciosManuales = new int[5][5][25];
    private final int[][][] matrizPreciosAPI = new int[5][5][25];

    // Variable global para saber qué material está seleccionado actualmente (por defecto 0 = Wood)
    private int materialActual = 0;

    /**
     * Creates new form PanelConfiguracion
     */
    public PanelConfiguracion() {
        initComponents();
        
        // Forzamos a que la primera vez que se abra muestre Madera (0) en todas las pestañas
        cargarDatosTabla(tablaMartlock, 0);
        cargarDatosTabla(tablaLymhurst, 1);
        cargarDatosTabla(tablaFortSterling, 2);
        cargarDatosTabla(tablaBridgewatch, 3);
        cargarDatosTabla(tablaThetford, 4); // Corregido a 'tablaThetford'
    }
    
    // ==========================================
    // MÉTODOS DE PROCESAMIENTO DE DATOS
    // ==========================================
    private void cargarDatosTabla(javax.swing.JTable tabla, int idCiudad) {
        javax.swing.table.DefaultTableModel modelo = (javax.swing.table.DefaultTableModel) tabla.getModel();
        modelo.setRowCount(0); // Limpiamos la tabla por seguridad

        String[] nombresTiers = {
            "T4.0", "T4.1", "T4.2", "T4.3", "T4.4",
            "T5.0", "T5.1", "T5.2", "T5.3", "T5.4",
            "T6.0", "T6.1", "T6.2", "T6.3", "T6.4",
            "T7.0", "T7.1", "T7.2", "T7.3", "T7.4",
            "T8.0", "T8.1", "T8.2", "T8.3", "T8.4"
        };

        for (int i = 0; i < 25; i++) {
            // NOTA: Asegúrate de tener esta imagen en tu carpeta de recursos del proyecto,
            // o cámbiala por una ruta válida para que no te lance NullPointerException.
            javax.swing.ImageIcon icono;
            try {
                icono = new javax.swing.ImageIcon(getClass().getResource("/resources/icon_placeholder.png"));
            } catch (Exception e) {
                icono = null; // Si no encuentra la imagen, la celda queda vacía temporalmente sin romper el programa
            }
            
            int precioManual = matrizPreciosManuales[materialActual][idCiudad][i];
            String precioAPI = matrizPreciosAPI[materialActual][idCiudad][i] + "s";

            // Añadimos la fila completa a la tabla
            modelo.addRow(new Object[]{icono, nombresTiers[i], precioManual == 0 ? "" : precioManual, precioAPI});
        }
    }

    private void guardarDatosTemporales(javax.swing.JTable tabla, int idCiudad) {
        // Validamos que la tabla tenga filas cargadas para evitar un NullPointerException
        if (tabla.getRowCount() < 25) return; 
        
        for (int i = 0; i < 25; i++) {
            Object valorCelda = tabla.getValueAt(i, 2); // Columna 2 es Precio Manual
            if (valorCelda != null && !valorCelda.toString().isEmpty()) {
                try {
                    matrizPreciosManuales[materialActual][idCiudad][i] = Integer.parseInt(valorCelda.toString().trim());
                } catch (NumberFormatException e) {
                    matrizPreciosManuales[materialActual][idCiudad][i] = 0;
                }
            } else {
                matrizPreciosManuales[materialActual][idCiudad][i] = 0; // Si el usuario borra el precio, se guarda como 0
            }
        }
    }

    // ==========================================
    // ACCIONES DE COMPONENTES (EVENTOS)
    // ==========================================
    // RECUERDA: Este método debe ser enlazado por NetBeans en la pestaña Design.
    // Si lo hiciste por doble clic, asegúrate de que el nombre coincida exactamente.
    private void btnClothActionPerformed(java.awt.event.ActionEvent evt) {                                         
        // 1. Guardamos lo que el usuario tenía escrito en el material anterior para las 5 ciudades
        guardarDatosTemporales(tablaMartlock, 0);
        guardarDatosTemporales(tablaLymhurst, 1);
        guardarDatosTemporales(tablaFortSterling, 2);
        guardarDatosTemporales(tablaBridgewatch, 3);
        guardarDatosTemporales(tablaThetford, 4);

        // 2. Cambiamos el índice al nuevo material (Cloth = 2)
        materialActual = 2;

        // 3. Volvemos a renderizar las tablas con los datos de las Telas
        cargarDatosTabla(tablaMartlock, 0);
        cargarDatosTabla(tablaLymhurst, 1);
        cargarDatosTabla(tablaFortSterling, 2);
        cargarDatosTabla(tablaBridgewatch, 3);
        cargarDatosTabla(tablaThetford, 4);
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

        jPanel1 = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        btnWood = new javax.swing.JButton();
        btnBar = new javax.swing.JButton();
        btnCloth = new javax.swing.JButton();
        btnHide = new javax.swing.JButton();
        tabCiudades = new javax.swing.JTabbedPane();
        panelMartlock = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaMartlock = new javax.swing.JTable();
        panelLymhurst = new javax.swing.JPanel();
        jScrollPane6 = new javax.swing.JScrollPane();
        tablaLymhurst = new javax.swing.JTable();
        panelFortSterling = new javax.swing.JPanel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaFortSterling = new javax.swing.JTable();
        panelBridgewatch = new javax.swing.JPanel();
        jScrollPane3 = new javax.swing.JScrollPane();
        tablaBridgewatch = new javax.swing.JTable();
        panelThetford = new javax.swing.JPanel();
        jScrollPane4 = new javax.swing.JScrollPane();
        tablaThetford = new javax.swing.JTable();
        jPanel2 = new javax.swing.JPanel();
        btnRefreshAPI = new javax.swing.JButton();
        btnUndo = new javax.swing.JButton();
        btnSavePrices = new javax.swing.JButton();

        jPanel1.setBackground(new java.awt.Color(37, 43, 51));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel3.setBackground(new java.awt.Color(47, 54, 64));
        jPanel3.setPreferredSize(new java.awt.Dimension(1300, 80));

        btnWood.setText("jButton1");

        btnBar.setText("jButton1");

        btnCloth.setText("jButton1");

        btnHide.setText("jButton1");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(117, 117, 117)
                .addComponent(btnWood)
                .addGap(34, 34, 34)
                .addComponent(btnBar)
                .addGap(47, 47, 47)
                .addComponent(btnCloth)
                .addGap(72, 72, 72)
                .addComponent(btnHide)
                .addContainerGap(690, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(29, Short.MAX_VALUE)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnWood)
                    .addComponent(btnBar)
                    .addComponent(btnCloth)
                    .addComponent(btnHide))
                .addGap(26, 26, 26))
        );

        jPanel1.add(jPanel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 25, -1, -1));

        panelMartlock.setLayout(new java.awt.BorderLayout());

        tablaMartlock.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "item", "Tier/Enc", "Precio Manual", "Precio API"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.Integer.class, java.lang.String.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, true, false
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane1.setViewportView(tablaMartlock);

        panelMartlock.add(jScrollPane1, java.awt.BorderLayout.CENTER);

        tabCiudades.addTab("Martlock", panelMartlock);

        panelLymhurst.setLayout(new java.awt.BorderLayout());

        tablaLymhurst.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "item", "Tier/Enc", "Precio Manual", "Precio API"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.Integer.class, java.lang.String.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, true, false
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane6.setViewportView(tablaLymhurst);

        panelLymhurst.add(jScrollPane6, java.awt.BorderLayout.CENTER);

        tabCiudades.addTab("Lymhurst", panelLymhurst);

        panelFortSterling.setLayout(new java.awt.BorderLayout());

        tablaFortSterling.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "item", "Tier/Enc", "Precio Manual", "Precio API"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.Integer.class, java.lang.String.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, true, false
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane2.setViewportView(tablaFortSterling);

        panelFortSterling.add(jScrollPane2, java.awt.BorderLayout.CENTER);

        tabCiudades.addTab("Fort Sterling", panelFortSterling);

        panelBridgewatch.setLayout(new java.awt.BorderLayout());

        tablaBridgewatch.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "item", "Tier/Enc", "Precio Manual", "Precio API"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.Integer.class, java.lang.String.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, true, false
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane3.setViewportView(tablaBridgewatch);

        panelBridgewatch.add(jScrollPane3, java.awt.BorderLayout.CENTER);

        tabCiudades.addTab("Bridgewatch", panelBridgewatch);

        panelThetford.setLayout(new java.awt.BorderLayout());

        tablaThetford.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "item", "Tier/Enc", "Precio Manual", "Precio API"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.String.class, java.lang.Integer.class, java.lang.String.class
            };
            boolean[] canEdit = new boolean [] {
                false, false, true, false
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jScrollPane4.setViewportView(tablaThetford);

        panelThetford.add(jScrollPane4, java.awt.BorderLayout.CENTER);

        tabCiudades.addTab("Thetford", panelThetford);

        jPanel1.add(tabCiudades, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 130, 1300, 630));

        btnRefreshAPI.setText("REFRES aPI");

        btnUndo.setText("jButton1");

        btnSavePrices.setText("SAVE");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(163, 163, 163)
                .addComponent(btnRefreshAPI)
                .addGap(79, 79, 79)
                .addComponent(btnUndo)
                .addGap(55, 55, 55)
                .addComponent(btnSavePrices)
                .addContainerGap(740, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap(34, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnRefreshAPI)
                    .addComponent(btnUndo)
                    .addComponent(btnSavePrices))
                .addGap(21, 21, 21))
        );

        jPanel1.add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(25, 790, 1300, 80));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 1350, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(0, 0, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, 1350, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGap(0, 0, Short.MAX_VALUE)))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 900, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(0, 0, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, 900, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGap(0, 0, Short.MAX_VALUE)))
        );
    }// </editor-fold>//GEN-END:initComponents


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnBar;
    private javax.swing.JButton btnCloth;
    private javax.swing.JButton btnHide;
    private javax.swing.JButton btnRefreshAPI;
    private javax.swing.JButton btnSavePrices;
    private javax.swing.JButton btnUndo;
    private javax.swing.JButton btnWood;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JScrollPane jScrollPane4;
    private javax.swing.JScrollPane jScrollPane6;
    private javax.swing.JPanel panelBridgewatch;
    private javax.swing.JPanel panelFortSterling;
    private javax.swing.JPanel panelLymhurst;
    private javax.swing.JPanel panelMartlock;
    private javax.swing.JPanel panelThetford;
    private javax.swing.JTabbedPane tabCiudades;
    private javax.swing.JTable tablaBridgewatch;
    private javax.swing.JTable tablaFortSterling;
    private javax.swing.JTable tablaLymhurst;
    private javax.swing.JTable tablaMartlock;
    private javax.swing.JTable tablaThetford;
    // End of variables declaration//GEN-END:variables
}
