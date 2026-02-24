---
title: "Custom Styling Data Table Columns and Rows"
id: "custom-styling-data-table-columns-rows"
last_update: { author: "Swetha Kundaram" }
---

Custom Styling allows the visual appearance of Data Table rows or columns to change dynamically based on data values.

Instead of applying static styles, styling rules can be conditionally applied at runtime using expressions or class bindings.

This approach ensures:

* Context-aware visual feedback
* Clear data emphasis
* Better readability
* UI-driven business highlighting

## What is Conditional Styling in Data Table?

Conditional Styling enables:

* Styling an entire row
* Styling a specific column
* Applying CSS classes dynamically
* Changing colors, fonts, background, or emphasis based on values

The styling logic is evaluated per row during rendering.


## When to Use Custom Styling

Custom styling is useful when:

* Highlighting critical values (e.g., low stock, high budget)
* Indicating status (Active, Inactive, Pending)
* Flagging threshold violations
* Differentiating priority records
* Improving visual hierarchy

Instead of manually scanning values, users can visually identify important records.


## Architecture Overview

Custom styling involves:

* Data Table bound to a dataset
* Conditional expression
* CSS class or inline style
* Runtime evaluation per row

### Runtime Flow

1. Data Table loads dataset
2. Each row is rendered
3. Expression evaluates row value
4. Style or class is applied conditionally

This separates:

* Data values
* Styling logic
* Presentation layer


## Column-Level Styling

Column styling applies visual rules to a specific column.

### Example Scenario

Highlight the Designation column when the employee belongs to the Executive Band.

#### Step 1: Add Custom CSS Class

Define CSS:

```
.executive-band {
    background-color: #e6f2ff;
    font-weight: 600;
}
```

#### Step 2: Apply Conditional Class

In Column Advanced Settings → View Mode:

Use expression:

```
{{row.getProperty('designation') === 'Executive' ? 'executive-band' : ''}}
```

This ensures:

* Only Executive-level employees are highlighted
* Styling communicates role hierarchy
* No backend changes required

## Row-Level Styling

Row styling affects the entire row instead of a single column.

### Example Scenario

Highlight row if department budget is below target.

#### Step 1: Define CSS

```
.low-budget-row {
    background-color: #fff4cc;
}
```


#### Step 2: Configure Row Class Binding

In Data Table → Row Class property:

```
{{row.getProperty('budget') < 50000 ? 'low-budget-row' : ''}}
```

This ensures:

* Entire row reflects business condition
* Visual attention is immediate
* Data remains unchanged


## Styling Based on Status Fields

Common pattern:

```
{{row.getProperty('status') === 'Inactive' ? 'inactive-row' : ''}}
```

Possible uses:

* Status indicators
* Priority tagging
* Approval workflows


## How It Works Together

In Custom Styling implementation:

* Dataset loads normally
* Row values are evaluated during rendering
* Expression determines CSS class
* CSS class applies visual changes
* UI updates dynamically

No service changes are required.
No backend modifications are needed.

All logic exists in the presentation layer.

## Best Practices

* Keep styling logic simple
* Avoid complex nested expressions
* Use CSS classes instead of heavy inline styles
* Separate styling rules from business logic
* Ensure accessibility (contrast and readability)

## Summary

Custom Styling in WaveMaker Data Table provides:

* Conditional row-level styling
* Conditional column-level styling
* Dynamic CSS binding
* Data-driven visual emphasis
* Clean separation between logic and presentation

This approach ensures that Data Tables do not merely display data —
they visually communicate meaning based on runtime conditions.

