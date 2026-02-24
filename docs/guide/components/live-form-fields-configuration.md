---
title: "Live Form – Fields Configuration"
id: "live-form-fields-configuration"
last_update: { author: "Swetha Kundaram" }
---

Live Forms allow structured interaction with database-backed entities.

Field configuration enables developers to control how each field behaves, validates input, renders widgets, and responds to user interaction.

This approach ensures:

* Controlled data input
* Context-aware field behavior
* Structured validation
* Flexible UI representation

## What is Live Form Field Configuration?

Live Form Field Configuration allows developers to:

* Control display properties
* Define widget types
* Apply validations
* Configure cascading filters
* Customize runtime behavior

Each field in a Live Form can be individually governed without modifying the underlying entity.


## Field Display Configuration

Field display settings are available under Advanced Settings and Canvas properties.

### Cascading Data (Filter on Field)

Fields can restrict values based on another field.

Example:

* State field selected
* City field filters based on selected State

Configuration:

* Set Filter on Field property for City → State

This ensures:

* Contextual value restriction
* Cleaner dependent field logic
* Reduced invalid selections

### Widget Selection

Each field can be represented using a different widget.

Available widgets depend on data type.

Examples:

* Text → Input Text, Text Area
* Number → Number Input
* Date → Date Picker
* Boolean → Switch

Widget selection affects:

* Input behavior
* UI appearance
* Validation options

### Custom Columns

Custom columns can be added using the “+” option.

Note:

If a custom column is not selected for display, it is deleted when the Form Designer is saved.

This ensures:

* Controlled field structure
* No unused configuration persistence

### Field Behavior Configuration

Individual field properties can be modified directly from the canvas.

#### Display Title

* Custom label for field
* Can be bound to another variable

#### Input Type

Used for on-screen validation.

Example:

* Email input ensures valid email format

#### Default Value

* Static value
* Or bound to a variable

#### Update Behavior

Control when data updates:

* On Blur
* On Keypress

Optional:

* Set delay in milliseconds

#### Visibility and Behavior Controls

Fields can be set as:

* Auto Focus
* Read Only
* Hidden / Visible

### Referenced Entity Filters

Filter criteria can be applied to referenced entities for controlled data selection.


## Live Form Validations

Live Forms support validation based on field type.

### Required Fields

Enable Required to:

* Prevent submission without value
* Trigger validation error


### Text Field Validations

* Regular Expression (Pattern Matching)
* Maximum Characters


### Number Field Validations

* Minimum Value
* Maximum Value


### Date Field Validations

* Minimum Date
* Maximum Date
* Excluded Dates
* Excluded Days

Invalid dates are disabled in the Date Picker.

### Highlight Invalid Fields

The `highlightInvalidFields` method can be invoked during Save to:

* Highlight invalid fields in red
* Display validation messages

This ensures visual feedback before submission.


## Custom Validation Using Events

For advanced validation scenarios, use the Before Service Call event.

This executes logic before updating the data source.

Example:

```
Page.liveform1Beforeservicecall = function($data, $event) {
    function isValidData($data) {
        if ($data.password) {
            if ($data.password.length < 6) {
                return {
                    'error': "Password too small"
                };
            }
        } else {
            return {
                'error': "Password field required"
            };
        }
    }
    return isValidData($data)
};
```

This ensures:

* Business logic validation
* Controlled data submission
* Pre-service execution checks

## Using Widgets for Live Form Fields

Widgets can enhance field interaction.

### When Options Are Limited

Use:

* Select
* Radioset
* Switch

Best for small, predefined option sets.

### When Options Are Large

Use:

* Autocomplete

Enables search-based selection.


### When Multiple Selection Is Required

Use:

* Checkboxset
* Select (Multiple Enabled)

Allows selecting more than one option.

## Implementation Workflow

### Step 1: Add Live Form

* Drag and drop Live Form
* Bind to Database CRUD Variable

### Step 2: Configure Layout

Set layout structure based on UI requirements.


### Step 3: Configure Field Widget

1. Select field from canvas
2. Change widget type (e.g., Select)
3. Dataset auto-populates from Variable dataset
4. Data Field and Display Field default to key

Dataset can be rebound to:

* Another variable
* Another widget

Widget type can also be modified from Advanced Settings.


## How It Works Together

In Live Form Field Configuration:

* Entity defines base structure
* Live Form binds to CRUD variable
* Advanced Settings control display
* Widgets define interaction
* Validations enforce correctness
* Events enforce business logic
* Save action commits valid data

This separates:

* Data structure
* UI representation
* Validation logic
* Business rules

## Summary

Live Form Field Configuration in WaveMaker provides:

* Cascading field control
* Flexible widget selection
* Field-level behavior customization
* Type-based validation options
* Pre-service custom validation
* Structured UI governance

This approach ensures that Live Forms are not simply data entry screens —
they are controlled, validated, and context-aware data management interfaces.

