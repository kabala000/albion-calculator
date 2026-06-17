/**
 
 * @author vehuiah
 */
import Conexion.Conexion;
import Paneles.Crafteo;
import Paneles.Inventario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class VentanaPrincipal extends javax.swing.JFrame {
    
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(VentanaPrincipal.class.getName());

    /**
     * Creates new form VentanaPrincipal
     */
    public VentanaPrincipal() {
        initComponents();
        this.setLocationRelativeTo(null); // Poner en el centro
        listarTablas();
    }
    
    // Método para cambiar el panel mostrado
private void mostrarPanel(javax.swing.JPanel panel) {
    PanelContenido.removeAll();
    panel.setPreferredSize(new java.awt.Dimension(1400, 800));
    PanelContenido.add(panel, java.awt.BorderLayout.CENTER);
    PanelContenido.revalidate();
    PanelContenido.repaint();
}


public static void listarTablas() {
    String sql = "SELECT name FROM sqlite_master WHERE type='table'";
    
    try (Connection con = Conexion.getConexion();
         PreparedStatement ps = con.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {

        System.out.println("Tablas encontradas:");
        while (rs.next()) {
            System.out.println("- " + rs.getString("name"));
        }

    } catch (SQLException e) {
        System.out.println("Error listando tablas: " + e.getMessage());
    }
}
    

    
    
    
    
    
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel2 = new javax.swing.JPanel();
        PanelContenido = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        btnInventario = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        btnInicio = new javax.swing.JButton();
        INICIO2 = new javax.swing.JButton();
        btnCrafteo = new javax.swing.JButton();
        INICIO4 = new javax.swing.JButton();
        jButton1 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setPreferredSize(new java.awt.Dimension(1600, 900));
        setResizable(false);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel2.setBackground(new java.awt.Color(11, 15, 21));
        jPanel2.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(20, 24, 30), 1, true));

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 1598, Short.MAX_VALUE)
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 98, Short.MAX_VALUE)
        );

        getContentPane().add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 1600, 100));

        PanelContenido.setBackground(new java.awt.Color(7, 11, 14));
        PanelContenido.setLayout(new java.awt.BorderLayout());
        getContentPane().add(PanelContenido, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 100, 1400, 800));

        jPanel3.setBackground(new java.awt.Color(2, 6, 24));
        jPanel3.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(45, 33, 20), 2, true));
        jPanel3.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        btnInventario.setText("INVENTARIO");
        btnInventario.addActionListener(this::btnInventarioActionPerformed);
        jPanel3.add(btnInventario, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 400, 160, -1));

        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel1.setText("LOGO");
        jPanel3.add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 20, 130, 120));

        btnInicio.setText("INICIO");
        btnInicio.addActionListener(this::btnInicioActionPerformed);
        jPanel3.add(btnInicio, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 180, 160, -1));

        INICIO2.setText("ORDEN DE VENTAS");
        INICIO2.addActionListener(this::INICIO2ActionPerformed);
        jPanel3.add(INICIO2, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 280, 160, -1));

        btnCrafteo.setText("CRAFTEO");
        btnCrafteo.addActionListener(this::btnCrafteoActionPerformed);
        jPanel3.add(btnCrafteo, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 210, 160, -1));

        INICIO4.setText("ORDEN DE COMPRA");
        INICIO4.addActionListener(this::INICIO4ActionPerformed);
        jPanel3.add(INICIO4, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 250, 160, -1));

        jButton1.setText("GESTION DE PRECIOS");
        jPanel3.add(jButton1, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 320, 160, -1));

        getContentPane().add(jPanel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 100, 200, 800));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnInventarioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnInventarioActionPerformed
mostrarPanel(new Inventario());
    }//GEN-LAST:event_btnInventarioActionPerformed

    private void btnInicioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnInicioActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnInicioActionPerformed

    private void INICIO2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_INICIO2ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_INICIO2ActionPerformed

    private void btnCrafteoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCrafteoActionPerformed
 mostrarPanel(new Crafteo());
    }//GEN-LAST:event_btnCrafteoActionPerformed

    private void INICIO4ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_INICIO4ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_INICIO4ActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ReflectiveOperationException | javax.swing.UnsupportedLookAndFeelException ex) {
            logger.log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(() -> new VentanaPrincipal().setVisible(true));
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton INICIO2;
    private javax.swing.JButton INICIO4;
    private javax.swing.JPanel PanelContenido;
    private javax.swing.JButton btnCrafteo;
    private javax.swing.JButton btnInicio;
    private javax.swing.JButton btnInventario;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    // End of variables declaration//GEN-END:variables
}
