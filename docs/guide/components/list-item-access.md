---
title: "Accessing List Items"
id: "list-item-access"
last_update: { author: "WaveMaker" }
---

1. **currentItem & currentItemWidgets**: The *currentItem* bind object can be used to bind the current item of the list to any form widget placed within the list template. The currentItemWidgets can be accessed as the fourth argument of the events for widgets within the List. For example, button click event within List will result in the following code will capture the caption property of the Name label within a List:

   ```javascript
   Page.button1Click = function($event, widget, item, currentItemWidgets) {
           alert(currentItemWidgets.Name.caption);
       };
   ```

2. **selecteditem & selectedItemWidgets**: The *selecteditem* bind object can be used to capture the selected item of the list when selection is enabled for the List. The return type would be array in case of multi-select List. *selecteditem* and *selectedItemWidgets* can be accessed through the script as follows, the click of a button will capture the selected item firstname and the caption of widget Name:

   ```javascript
   Page.button1Click = function($event, widget, item, currentItemWidgets) {
           alert(Page.Widgets.livelist1.selecteditem.firstname);
           alert(Page.Widgets.livelist1.selectedItemWidgets.Name.caption);
       };
   ```

[![](./assets/img/list_bind.png)](./assets/img/list_bind.png)We have used the following JavaScript for the onSelect event of the List:

```javascript
Page.select1Change = function ($event, widget, item, currentItemWidgets, newVal, oldVal) {
    Page.Variables.NorthwindProducttestData.setFilter('subcategory', currentItemWidgets.select1.datavalue);
    Page.Variables.NorthwindProducttestData.update();
};
```

<iframe width="708" height="560" src="https://docs.google.com/presentation/d/e/2PACX-1vSaqO-P670e2Y7PA9bKWPnjAcHbVjcAgMuzSF-h0pdOpEnqLARo_LhX_wgiFkOG76Dd_W8_00NxMp-4/embed?start=false&loop=false&delayms=3000" frameborder="0" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" />

[List Use Cases](#)

- [1. List Basic Usage](./list-basic-usage.md)
- [2. How to group list items](./list-grouped.md)
- [3. How to group list items based upon multiple fields](./list-multi-grouped.md)
- [4. How to include data table within a list](./list-data-table.md)
- [5. How to build editable list using live form](./building-editable-list.md)
- [6. How to build list from the selected item of another list](./building-cascading-lists.md)
- [7. How to access list items](./list-item-access.md)
