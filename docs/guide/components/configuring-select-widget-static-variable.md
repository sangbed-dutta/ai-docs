---
title: "Configuring Select Widget from a Static Variable"
id: "configuring-select-widget-static-variable"
last_update: { author: "WaveMaker" }
---

---

Instead of having a [comma-separated list](./configuring-select-widget-static-list-values.md), one can use a Static Variable to hold the list and then bind it to the Select widget. This will enable us to reuse the list at multiple places, if needed.

1. [Create a Static Variable](#), choose the Is List and add the list values: [![sel\_listvar](./assets/img/sel_listvar.png)](./assets/img/sel_listvar.png)
2. Bind the Select Widget to the Static Variable dataset: [![sel\_listvar\_bind](./assets/img/sel_listvar_bind.png)](./assets/img/sel_listvar_bind.png)
3. Set the Datafield value to the datavalue of the static variable. This is the value that is selected by the user: [![sel\_listvar\_props](./assets/img/sel_listvar_props.png)](./assets/img/sel_listvar_props.png)
4. Running the app will result in the display of the Select widget [![sel\_listvar\_run1](./assets/img/sel_listvar_run1.png)](./assets/img/sel_listvar_run1.png) [![sel\_listvar\_run2](./assets/img/sel_listvar_run2.png)](./assets/img/sel_listvar_run2.png)

## See Also

[Select Use Cases](#)
