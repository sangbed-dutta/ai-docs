---
title: "Dynamic Data Tables"
id: "creating-dynamic-data-table"
last_update: { author: "Swetha Kundaram" }
---


Dynamic Data Tables are used when the structure of data is not fixed.

In many real-world applications, especially those powered by APIs or database queries, the number of columns, column names, and data types may vary based on user roles, filters, or business logic.

Instead of building separate tables for every data variation, a dynamic Data Table adapts at runtime to the structure returned by a service.

This approach ensures:

* Flexibility in handling varying datasets
* Reduced UI duplication
* Easier long-term maintenance
* Cleaner implementation logic


## What is a Dynamic Data Table?

A Dynamic Data Table in WaveMaker allows the Data Table widget to:

* Detect metadata from the service response
* Generate columns dynamically
* Render variable datasets without manual column definition
* Adapt to runtime conditions

The table structure is governed by the metadata received from the bound service or variable.

## Core Use Case: Inventory Dashboard

In an Inventory Dashboard, a warehouse manager may need to view inventory in different formats:

* All Items
* Low Stock Items
* Out of Stock Items

Each view retrieves data from a different service, and each service may return a different structure.

Instead of configuring multiple tables, a single dynamic Data Table can adapt to each dataset.

This ensures:

* One reusable grid
* Consistent UI behavior
* Simplified logic management


## Architecture Elements

| Category | Element          | Role                                 |
| -------- | ---------------- | ------------------------------------ |
| Widget   | Data Table       | Renders dynamic dataset              |
| Service  | REST / Database  | Provides variable response structure |
| Variable | Service Variable | Stores and binds dynamic response    |
| Metadata | Runtime Columns  | Defines column structure dynamically |


## Implementation Approaches

Dynamic Data Tables can be implemented using two approaches:

1. Single Service with Dynamic Metadata
2. Multiple Services Bound to One Grid


## Approach 1: Using a Single Service

In this approach, one service returns data whose metadata changes based on conditions.

The Data Table must be configured to:

* Enable “The columns are dynamic” option
* Bind to the API-based variable
* Enable “Update Data on Input Change” behavior (if required)

How It Works:

* Service returns dynamic column metadata
* Variable stores response
* Data Table reads metadata
* Columns are generated at runtime

This ensures:

* No manual column configuration
* Automatic adaptation to data changes
* Simplified service-driven UI


## Approach 2: Using Multiple Services

In this approach, different services return different datasets, and the grid switches between them at runtime.

### Example Scenario

Switching between USER and DEPARTMENT datasets on button click.

#### Step 1: Create Queries

DeptData:

```
select * from DEPARTMENT
```

UserData:

```
select * from USER
```

#### Step 2: Create Database API Variables

* Create variables for DeptData and UserData
* Enable “Request Data on Page Load”

#### Step 3: Configure UI

* Add two Buttons:

  * Show Department Data
  * Show User Data
* Add one Data Table
* Enable “The columns are dynamic”
* Bind to one variable initially
* Rename Data Table (e.g., SVGrid)

#### Step 4: Add Runtime Switching Logic

```javascript
Page.button1Click = function ($event, widget) {
    Page.Widgets.SVGrid.dataset = Page.Variables.DeptData.dataSet;
};

Page.button2Click = function ($event, widget) {
    Page.Widgets.SVGrid.dataset = Page.Variables.UserData.dataset;
};
```

How It Works:

* Buttons trigger dataset switch
* Grid reads new metadata
* Columns re-render dynamically
* Table structure updates automatically

This ensures:

* Single reusable grid
* Controlled runtime switching
* Clean separation between services and UI

## How It Works Together

In a Dynamic Data Table implementation:

* Services provide dataset and metadata
* Variables store runtime response
* Data Table consumes metadata
* Columns are generated dynamically
* Runtime events can switch datasets
* The UI updates without manual reconfiguration

This architecture separates:

* Data structure
* UI rendering
* Runtime logic

Allowing applications to scale without rigid table definitions.


## Summary

Dynamic Data Tables in WaveMaker provide:

* Runtime-driven column generation
* Flexible service-based metadata handling
* Single-grid reuse across datasets
* Clean implementation using variables and events
* Scalable UI architecture for variable data structures

This approach ensures that data presentation remains adaptive, maintainable, and structurally governed.