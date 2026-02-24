---
title: "Combining Columns in Data Table"
id: "combining-columns-in-data-table"
last_update: { author: "Swetha Kundaram" }
---


Column combination allows multiple data fields to be calculated and displayed as a single column inside a Data Table.

Instead of modifying the database or backend service, calculated values can be defined directly in the Data Table configuration using value expressions.

This approach ensures:

* Runtime calculations without backend changes
* Cleaner data presentation
* Reduced UI clutter
* Flexible display logic

## What is Column Combination?

Column Combination in WaveMaker enables:

* Creating derived columns
* Performing inline calculations
* Displaying computed values dynamically
* Preserving original dataset integrity

The Data Table continues to fetch raw data, while calculated columns are rendered at the UI level.

## Core Use Case

Department Budget Overview.

Objective:

From the Department table:

* Combine Q1 and Q2 → Display as H1 (First Half-Year)
* Combine Q3 and Q4 → Display as H2 (Second Half-Year)

Source Dataset: hrdb → Department

The Data Table must calculate and display half-year totals without altering the database schema.


## Architecture Overview

The implementation involves:

* Department Data Table
* Existing quarterly fields (Q1, Q2, Q3, Q4)
* Derived columns (H1, H2)
* Value Expressions

### Runtime Flow

1. Data Table loads Department data
2. Quarterly fields are available in each row
3. Value Expression calculates totals
4. Derived columns render computed values

This separates:

* Stored data
* Computed display logic
* UI presentation layer


## Implementation Workflow

### Pre-requisites

* Create a Web Responsive Application
* Import sample hrdb database
* Add a Data Table bound to Department entity


### Step 1: Add Derived Columns

1. Select the Data Table
2. Go to Advanced Settings
3. Open the Columns tab
4. Add two new columns:

   * H1
   * H2

These will display half-year totals.


### Step 2: Configure Value Expression

In the View Mode section of the H1 column, enter:

```
{{row.getProperty('q1') + row.getProperty('q2')}}
```

This calculates:

H1 = Q1 + Q2

For H2, use:

```
{{row.getProperty('q3') + row.getProperty('q4')}}
```

This calculates:

H2 = Q3 + Q4

Note:

`q1`, `q2`, `q3`, `q4` refer to the mapped column names in the dataset.

## How It Works Together

In Column Combination:

* Raw quarterly values are retrieved from the database
* The Data Table exposes each row
* Value Expressions perform runtime calculation
* Derived columns display computed totals

No database modification is required.
No service changes are required.

The calculation exists entirely in the UI layer.


## Summary

Combining Columns in WaveMaker Data Table provides:

* Runtime field calculation
* Derived column rendering
* Clean UI-level computation
* Separation between stored data and displayed logic

This approach ensures that computed values are presented dynamically —
while preserving the integrity of the original dataset.
