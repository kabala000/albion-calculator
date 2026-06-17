package Paneles;

/**
 *
 * @author vehuiah
 */
public class Inventario extends javax.swing.JPanel {
    public Inventario() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jComboBox1 = new javax.swing.JComboBox<>();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        jComboBox2 = new javax.swing.JComboBox<>();
        cbxTier = new javax.swing.JComboBox<>();
        jTextField1 = new javax.swing.JTextField();
        jButton1 = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        PanelInventario = new javax.swing.JPanel();

        jPanel1.setBackground(new java.awt.Color(7, 11, 15));
        jPanel1.setPreferredSize(new java.awt.Dimension(1400, 800));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel2.setBackground(new java.awt.Color(2, 6, 24));
        jPanel2.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(29, 17, 56), 2, true));
        jPanel2.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel4.setFont(new java.awt.Font("DejaVu Sans Condensed", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(161, 102, 216));
        jLabel4.setText("INGRESO MANUAL DE MATERIALES");
        jPanel2.add(jLabel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 270, 40));

        jLabel5.setForeground(new java.awt.Color(19, 22, 26));
        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel5.setText("_________________________________________   ____");
        jPanel2.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 30, 340, -1));

        jLabel6.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(92, 104, 126));
        jLabel6.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel6.setText("CANTIDAD A SUMAR");
        jPanel2.add(jLabel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 210, 380, 30));

        jComboBox1.setBackground(new java.awt.Color(15, 23, 43));
        jComboBox1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        jComboBox1.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { ".0", ".1", ".2", ".3", ".4" }));
        jPanel2.add(jComboBox1, new org.netbeans.lib.awtextra.AbsoluteConstraints(210, 170, 180, -1));

        jLabel7.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(92, 104, 126));
        jLabel7.setText("TIPO DE RECURSO:");
        jPanel2.add(jLabel7, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 70, 140, 30));

        jLabel8.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(92, 104, 126));
        jLabel8.setText("TIER:");
        jPanel2.add(jLabel8, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 140, 50, 30));

        jLabel9.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(92, 104, 126));
        jLabel9.setText("ENCANTAMIENTO:");
        jPanel2.add(jLabel9, new org.netbeans.lib.awtextra.AbsoluteConstraints(210, 140, 150, 30));

        jComboBox2.setBackground(new java.awt.Color(15, 23, 43));
        jComboBox2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        jComboBox2.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        jPanel2.add(jComboBox2, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 100, 380, -1));

        cbxTier.setBackground(new java.awt.Color(15, 23, 43));
        cbxTier.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 15)); // NOI18N
        cbxTier.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "T4", "T5", "T6", "T7", "T8" }));
        cbxTier.addActionListener(this::cbxTierActionPerformed);
        jPanel2.add(cbxTier, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 170, 180, -1));

        jTextField1.setBackground(new java.awt.Color(15, 23, 43));
        jTextField1.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        jTextField1.setText("0");
        jTextField1.addActionListener(this::jTextField1ActionPerformed);
        jPanel2.add(jTextField1, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 240, 280, -1));

        jButton1.setBackground(new java.awt.Color(152, 16, 250));
        jButton1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 14)); // NOI18N
        jButton1.setText("+ REGISTRAR EN ALMACEN");
        jButton1.setToolTipText("");
        jPanel2.add(jButton1, new org.netbeans.lib.awtextra.AbsoluteConstraints(70, 290, 300, -1));

        jPanel1.add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 80, 400, 350));

        jLabel1.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 18)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Inventario ");
        jPanel1.add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 10, 390, 30));

        jLabel2.setFont(new java.awt.Font("DejaVu Sans Condensed", 0, 10)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Revision del stack de Materiales  runas y Artefactos disponibles  (Los consumos por crafteo se deducen automaticamente en tiermpo real)");
        jPanel1.add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 30, -1, -1));

        jLabel3.setForeground(new java.awt.Color(19, 22, 26));
        jLabel3.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel3.setText("____________________________________________________________________________________________________________________________________________________________________");
        jPanel1.add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 40, -1, -1));

        PanelInventario.setBackground(new java.awt.Color(5, 9, 19));
        PanelInventario.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(8, 12, 22), 2, true));
        jPanel1.add(PanelInventario, new org.netbeans.lib.awtextra.AbsoluteConstraints(450, 80, 900, 710));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 1400, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(0, 0, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGap(0, 0, Short.MAX_VALUE)))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 800, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addGroup(layout.createSequentialGroup()
                    .addGap(0, 0, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGap(0, 0, Short.MAX_VALUE)))
        );
    }// </editor-fold>//GEN-END:initComponents

    private void cbxTierActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxTierActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_cbxTierActionPerformed

    private void jTextField1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jTextField1ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jTextField1ActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelInventario;
    private javax.swing.JComboBox<String> cbxTier;
    private javax.swing.JButton jButton1;
    private javax.swing.JComboBox<String> jComboBox1;
    private javax.swing.JComboBox<String> jComboBox2;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JTextField jTextField1;
    // End of variables declaration//GEN-END:variables
}
