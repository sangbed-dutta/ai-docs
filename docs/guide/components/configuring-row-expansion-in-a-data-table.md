---
title: "Configuring Row Expansion in a Data Table"
id: "configuring-row-expansion-in-a-data-table"
last_update: { author: "Swetha Kundaram" }
---

Row Expansion allows additional content to be displayed inside a Data Table row.

Instead of navigating to another page, related information can be rendered inline using a Partial. This enables contextual data viewing while maintaining the parent dataset.

This approach ensures:

* Hierarchical data display
* Clean parent-child relationship rendering
* Reusable UI components
* Structured data filtering


## What is Row Expansion?

Row Expansion in WaveMaker enables:

* Expanding a row inside a Data Table
* Rendering a Partial within the expanded section
* Passing selected row data to the Partial
* Filtering related data dynamically

The Partial acts as a reusable sub-view that renders contextual information based on the selected row.


## Core Use Case

Department → Employees relationship.

Objective:

Display a list of Departments in a Data Table.
When a Department row is expanded, display the Employees belonging to that Department.

Parent Entity: Department
Child Entity: Employee

The Employee list must filter dynamically based on the selected Department ID.


## Architecture Overview

The implementation involves:

* Department Page (Parent View)
* Employees Partial (Child View)
* Page Parameters
* Filtered Service Variable
* Row Expansion Configuration

### Runtime Flow

1. Department Data Table loads departments
2. User expands a row
3. Selected Department ID is passed to Partial
4. Partial filters Employee data using Page Param
5. Employee List renders inside expanded row

This separates:

* Parent dataset
* Child dataset
* Filtering logic
* Rendering logic


## Implementation Workflow

### Step 1: Create Department Page

1. Create a Page named **Department**
2. Drag and drop a **Data Table**
3. Bind Data Table to Department entity

   * Retrieve Data From → Services
   * Select hrdb → Department
   * Variable auto-created (e.g., HrdbDepartmentData)
4. Enable:

   * Records per request
   * Update Data on Input Change
   * Request Data on Page Load
5. Choose:

   * ReadOnly function
   * Simple View
   * Pagination (e.g., Basic)

This creates the parent dataset.

### Step 2: Create Employees Partial

Create a Partial to render Employee details.

1. Create → Partial
2. Name it **Employee**
3. Use Blank Template

#### Configure Page Param

Add a Page Parameter:

* Name: deptID
* Type: integer

This parameter receives the selected Department ID.

### Step 3: Configure Employee List

Inside the Partial:

1. Drag and drop a **List Widget**
2. Bind it to Employee entity

   * Select hrdb → Employee
   * Variable auto-created (e.g., HrdbEmployeeData)
3. Enable:

   * Update Data on Input Change
4. Disable:

   * Request Data on Page Load

Choose:

* Template type (e.g., Contact List)
* Pagination (e.g., Basic)

Bind fields:

* Picture → picurl
* Name → username

This sets up the child dataset view.

## Filtering Employee Data

The Employee dataset must filter based on deptID.

### Configure Filter Criteria

1. Open Variables dialog
2. Select HrdbEmployeeData
3. Go to Filter Criteria
4. Set condition:

```
deptId is equal to bind:pageParams.deptID
```

This ensures:

* Employees are filtered per selected Department
* Data updates when deptID changes
* Partial remains reusable

## Configuring Row Expansion

Now connect the Partial to the Department Data Table.

### Enable Row Expansion

In the Department Page:

1. Select Data Table
2. Go to Advanced Settings
3. Navigate to Row Detail tab
4. Enable Row Expansion

#### Configure Row Detail

* Content → Select Employee Partial
* Partial Param → deptID

Bind deptID to:

```
bind:Widgets.DepartmentTable1.selecteditem.deptId
```

This passes the selected row’s department ID to the Partial.

## How It Works Together

In Row Expansion implementation:

* Data Table displays parent records
* User expands a row
* Selected item is captured
* Department ID is passed to Partial
* Partial filters Employee dataset
* Employee List renders dynamically

The Partial does not hardcode department logic.
It relies entirely on Page Parameters.

This architecture enables:

* Reusable child views
* Clean data separation
* Controlled filtering
* Scalable parent-child rendering



## Summary

Row Expansion in WaveMaker provides:

* Inline hierarchical data display
* Parent-child data relationship rendering
* Partial-based reusable components
* Page Parameter driven filtering
* Structured, scalable UI architecture

This approach ensures that related data is not navigated away from —
it is contextually expanded within the same structured Data Table environment.

