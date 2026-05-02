package com.test.site_ong.event_photos.model;

public class ReorderItem {
    private Long id;
    private Integer displayOrder;

    public ReorderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
