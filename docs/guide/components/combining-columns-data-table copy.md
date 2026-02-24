---
title: "Capturing Data from Wizard Steps with Forms"
id: "capturing-data-from-wizard-steps-with-forms"
last_update: { author: "Swetha Kundaram" }
---

Wizards are used for multi-step workflows where data must be collected in a structured sequence.

When combined with Live Forms, a Wizard allows each step to capture a portion of data, validate it, and either proceed to the next step or complete the process.

This approach ensures:

* Structured data collection
* Step-wise validation
* Controlled navigation
* Conditional task completion


## What is a Wizard with Forms?

A Wizard is a multi-step UI component that:

* Guides users through sequential steps
* Provides Next, Previous, Done, and Cancel actions
* Supports step-level validation and logic

When Live Forms are embedded inside Wizard steps:

* Each step captures structured entity data
* Built-in form validations apply automatically
* Navigation can be conditionally controlled


## Core Use Case

Registration Workflow.

Objective:

1. Collect Personal Data
2. Collect Professional Data (if applicable)
3. Mark user as Registered
4. Display confirmation

Entities involved:

* Person
* Profile
* Professional

The Wizard must allow early completion if the user is not employed.

## Architecture Overview

The implementation involves:

* Registration Page (Entry Point)
* Wizard Page (Multi-Step Data Capture)
* Live Forms per step
* Service Variables for update
* Conditional navigation logic

### Runtime Flow

1. User enters basic details
2. Wizard launches
3. Step 1 captures Personal Data
4. If employed → move to Step 2
5. If not employed → enable Done in Step 1
6. On Done → update Person record
7. Show confirmation

This separates:

* Data capture
* Navigation control
* Business logic execution

## Wizard Configuration

### Basic Features

* Add steps using “Add Step”
* Next button appears on all steps except last
* Done button appears on final step
* Previous button appears on all except first

Customizable:

* Next caption
* Previous caption
* Done caption
* Cancel caption

Buttons can be enabled/disabled using scripting:

```
wizardstep2.enabledone = true;
wizardstep2.disableprevious = false;
```

## Step Configuration

Each Wizard Step supports:

* Title
* Inline Content
* Show / Hide
* Enable Skip
* Step-level Events

Important:

Partial content cannot be used inside Wizard steps.
Only inline content is supported.

## Implementation Workflow

### Step 1: Setup Entry Page

Create Page: **UserRegistration**

* Add Data Table for Person entity
* Add button to navigate to Wizard page


### Step 2: Create Wizard Page

Create Page: **WizardBasic**

1. Drag and drop Wizard
2. Rename Step 1 → Personal Data
3. Add Step 2 → Professional Data


### Step 3: Design Step UI

#### Step 1 – Personal Data

* Add Live Form
* Bind to Personal entity
* Use 3-column layout

#### Step 2 – Professional Data

* Add Live Form
* Bind to Professional entity
* Use 1-column layout

Live Form validations apply automatically.


## Conditional Navigation Logic

### Scenario: User Not Employed

If user selects "No" for Employed field:

* Enable Done button in Step 1
* Skip Professional Data step

Example (On Blur event of employed field):

```
Page.employedBlur = function($event, widget) {
    var employed = Page.Widgets.employed.datavalue;
    if (employed == "No")
        Page.Widgets.wizardstep2.enabledone = true;
    else
        Page.Widgets.wizardstep2.enabledone = false;
};
```

This allows:

* Early completion
* Conditional flow control
* Business-driven navigation


## Handling On Done Event

When user completes the Wizard:

1. Retrieve form data
2. Update backend record
3. Show confirmation

Example:

```
Page.wizard1Done = function(widget, steps) {
    var liveData = Page.Widgets.liveform2.dataset.data;
    var profileData = liveData[liveData.length - 1];
    var userName = profileData.personByPerson.userName;

    Page.Variables.UpdateRegistered.setInput('uid', userName);
    Page.Variables.UpdateRegistered.update();

    DialogService.open('alertdialog1', Page, {
        'mode': 'edit',
        'showInUserMode': true
    });
};
```

This ensures:

* Data consolidation
* Service update execution
* User feedback


## Wizard Events

Available Events:

* On Load
* On Next
* On Prev
* On Done
* On Cancel
* On Skip

Each event provides access to:

* Wizard scope
* Step scope

This enables:

* Dynamic field updates
* Data validation before navigation
* Conditional branching


## How It Works Together

In Wizard with Forms implementation:

* Each step captures structured data
* Live Form handles validation
* Step events control navigation
* Done event consolidates data
* Service variables update backend
* Dialog confirms completion

Navigation and data capture remain decoupled.

## Summary

Capturing Data from Wizard Steps with Forms provides:

* Structured multi-step workflows
* Integrated Live Form validation
* Conditional navigation control
* Event-driven logic handling
* Backend update orchestration

This approach ensures that complex processes are not executed in a single screen —
they are broken into governed, validated, step-driven interactions.

