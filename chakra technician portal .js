<button class="tp-filter-btn" id="tp-btn-today-tickets">
    <i class="fa fa-calendar-check-o"></i> Today's Tickets
</button>

this.wrapper.on("click", "#tp-btn-today-tickets", function() {
    self.open_today_tickets_dialog();
});

open_today_tickets_dialog() {
    let self = this;
    frappe.call({
        method: "vin_chakra.vin_chakra...get_portal_data",
        args: { status:"", priority:"", search_query:"", limit_start:0, limit_page_length:1000, view:"list" },
        callback: function(r) {
            if (!r.message) return;
            let today_str = frappe.datetime.get_today();
            let allowed_status = ["Working", "Resolved", "Closed"];
            let filtered = (r.message.tickets || []).filter(t => {
                return t.custom_date === today_str && allowed_status.includes(t.status);
            });
            self.show_today_tickets_dialog(filtered);
        }
    });
}


show_today_tickets_dialog(tickets) {
    let dialog = new frappe.ui.Dialog({...});
    let rows = tickets.map(t => `<tr>...</tr>`).join("");
    let html = `... table with rows ...`;
    dialog.get_field("today_tickets_html").$wrapper.html(html);
    dialog.$wrapper.find("#tp-btn-share-excel").on("click", function() {
        self.export_table_to_excel("tp-today-table", "today_tickets");
    });
    dialog.show();
}


export_table_to_excel(table_id, filename) {
    let table = document.getElementById(table_id);
    let template = `<html>...<body>${table.outerHTML}</body></html>`;
    let blob = new Blob(['\ufeff' + template], { type: 'application/vnd.ms-excel' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + "_" + frappe.datetime.get_today() + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
