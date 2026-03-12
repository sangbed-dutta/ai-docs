---
title: "Applying Live Filter to a Data Table or a Chart"
id: "live-filter-applying"
last_update: { author: "WaveMaker" }
---

1. Drag and drop a filter onto the canvas, setting the Service Type to Database CRUD, using hrdb Service and Department entity. Select Name for the Filter Fields. [![](./assets/img/lftr_apply_1.png)](./assets/img/lftr_apply_1.png)
2. Drag and drop *Data Table or Chart* widget on the page.
3. Bind the widget to the filter created by clicking on the *bind icon* next to the *Value* Property in the *Dataset* section of the Chart widget. In case of Data Table, select Filter Widget as source and the result as the data node.
4. Select the *Result* of the filter you just created from the *Widgets* tab on the **Bind** dialog box. [![](./assets/img/lftr_apply_bind.png)](./assets/img/lftr_apply_bind.png)
5. Select the x-axis and y-axis values for the chart. (in case of Data Table, select the columns to be displayed at the time of [configuration](#) or from [Advanced Settings](#)) [![](./assets/img/lftr_apply_chart.png)](./assets/img/lftr_apply_chart.png)
6. Run the application.
7. Select a value in the filter and click on *Filter* button and see the values change in the table/chart.

[Live Filter Use Cases](#)

- [1. Basic Usage Scenario](#)
- [2. How to Apply Live Filter to a Data Table/Chart](./live-filter-applying.md)
- [3. How to build a filtering based upon multiple values](./live-filter-multiple-values.md)
- [4. How to build a filtering based upon a range of values](./live-filter-range-filter.md)
