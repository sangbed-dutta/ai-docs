---
title: "Displaying Additional Components in Data Table"
id: "displaying-additional-components-data-table"
last_update: { author: "Swetha Kundaram" }
---

A Data Table is not limited to displaying plain text values.

In many applications, rows must display interactive or visual elements such as buttons, icons, images, switches, or custom widgets. These components enhance user interaction and improve contextual actions within the grid.

This approach ensures:

* Interactive row-level operations
* Rich data visualization
* Improved user experience
* Clean integration of UI controls within tabular data


## What Are Additional Components in a Data Table?

Displaying additional components means embedding widgets inside Data Table cells instead of showing raw values.

These components may include:

* Buttons
* Icons
* Images
* Toggle switches
* Labels with styling
* Custom widgets

The Data Table row becomes an interactive UI container rather than a static data row.


## When to Use Additional Components

Additional components are useful when:

* Row-level actions are required (Edit, Delete, Approve)
* Visual status indicators are needed
* Media such as images must be displayed
* Conditional UI behavior is required
* Inline interaction improves workflow

Instead of navigating away from the table, actions are performed directly inside it.

## Architecture Overview

The implementation involves:

* Data Table bound to a variable
* Column configured for custom display
* Embedded widget inside the column
* Optional event handling

### Runtime Flow

1. Data Table loads dataset
2. Each row renders columns
3. Selected column renders embedded widget
4. Widget interacts with row data

This separates:

* Data retrieval
* UI rendering
* Interaction handling


## Implementation Workflow

### Step 1: Bind Data Table

* Drag and drop a Data Table
* Bind it to a service or database variable
* Ensure dataset loads correctly


### Step 2: Add Custom Column

1. Go to Advanced Settings
2. Open Columns tab
3. Add a new column or modify an existing column
4. Set display type to Custom (or use View Mode expression)


### Step 3: Embed Component in Column

Use a widget inside the column template.

Examples:

### Button for Row Action

```
<Button caption="Edit"
        on-click="editRow(row)">
</Button>
```

#### Image Display

```
<Image source="{{row.getProperty('imageUrl')}}"></Image>
```

### Status Icon with Conditional Rendering

```
<Icon name="{{row.getProperty('status') === 'Active' ? 'check' : 'close'}}"></Icon>
```

Each widget can access row data using:

```
row.getProperty('<fieldName>')
```

## Handling Row-Level Events

Widgets inside Data Table rows can trigger actions such as:

* Navigating to another page
* Updating records
* Opening dialogs
* Calling services

Example:

```
Page.editRow = function(row) {
    // Custom logic
};
```

This ensures:

* Row context is preserved
* Actions are scoped to selected record
* Interaction remains controlled


## How It Works Together

In a Data Table with additional components:

* Dataset is retrieved
* Rows are generated
* Custom column renders widget
* Widget consumes row data
* Events trigger contextual logic

The Data Table acts as a container for both data and interaction.


## Summary

Displaying Additional Components in WaveMaker Data Table provides:

* Interactive row-level controls
* Embedded widgets inside grid cells
* Conditional rendering capability
* Seamless integration of UI actions with data

This approach transforms the Data Table from a static display component into an interactive, context-aware UI element.
