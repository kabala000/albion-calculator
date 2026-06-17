package database;

public class ItemData {

    public String item;
    public String tipoItem;

    public int lingotes;
    public int tablas;
    public int telas;
    public int cueros;

    public String artefacto1;
    public int cantidadArtefacto1;

    public String artefacto2;
    public int cantidadArtefacto2;

    // ✔ NOMBRES EXACTOS DE BD
    public String url_artefacto_1;
    public String url_artefacto_2;

    private String url_item;

    public ItemData() {}

    public String getUrl_item() {
        return url_item;
    }

    public void setUrl_item(String url_item) {
        this.url_item = url_item;
    }
    
    
    
}