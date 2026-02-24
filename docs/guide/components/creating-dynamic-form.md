---
title: "Dynamic Form"
id: "creating-dynamic-form"
last_update: { author: "Swetha Kundaram" }
---



A Dynamic Form is used when form fields are not fixed.

In many applications, form structures change based on business models, user roles, or frequently evolving requirements. Instead of configuring static fields in advance, a Dynamic Form renders its fields at runtime using metadata provided by an API.

This approach ensures:

* Runtime-driven field generation
* Reduced redevelopment effort
* Adaptability to changing requirements
* Clean separation between metadata and UI

## What is a Dynamic Form?

A Dynamic Form in WaveMaker is a service-driven Form that:

* Consumes metadata from an API
* Generates fields dynamically
* Applies validation rules at runtime
* Adapts layout and widgets based on metadata

Unlike static Forms, fields are not configured upfront.
The structure is determined entirely by metadata returned from the backend.

## When to Use Dynamic Forms

Dynamic Forms are beneficial when:

* Form requirements change frequently
* Form structure depends on business models
* Different user roles require different fields
* Customization must happen without code changes

By relying on metadata and APIs, Dynamic Forms eliminate the need for redeployment when field definitions change.

 

## Understanding Form Types

| Static Form                | Dynamic Form                   |
| -------------------------- | ------------------------------ |
| Fixed fields and labels    | No predefined fields           |
| Fields configured upfront  | Fields generated at runtime    |
| Validation defined in UI   | Validation defined in metadata |
| Layout manually structured | Layout determined dynamically  |

This distinction helps determine when runtime flexibility is required.



## Dynamic Form Architecture

A Dynamic Form implementation involves three key actors:

1. Backend Developer
2. WaveMaker Developer
3. End User

### Flow

* Backend Developer creates metadata and exposes it through an API
* WaveMaker Developer builds a Dynamic Form that consumes this metadata
* End User interacts with the generated Form

This architecture separates:

* Field definition (backend)
* UI rendering (frontend)
* Data entry (user interaction)

 

## Dynamic Form Metadata

Dynamic Forms depend entirely on metadata.

WaveMaker expects metadata as an array of objects, where each object represents a form field.

## Metadata Structure

```json
[{
  "name": "",
  "displayname": "",
  "type": "",
  "required": "",
  "widget": "",
  "dataset": ""
}]
```

Each object defines:

* Field name
* Display label
* Data type
* Validation rule
* Widget type
* Optional dataset

If the API returns a different structure, the metadata must be transformed before rendering.

This ensures:

* Predictable field generation
* Standardized structure
* Consistent runtime behavior

 

## How It Works Together

In a Dynamic Form implementation:

* API returns metadata
* Service Variable stores metadata
* Form binds to metadata
* Fields render dynamically
* User submits data

The Form does not store structural knowledge.
It relies entirely on metadata at runtime.

 

## Implementation Workflow

### Step 1: Import Metadata Service

A Dynamic Form requires a service that returns metadata.

This service can be:

* A REST API
* A Java Service
* An existing external API

The API must return field definitions in metadata format.

 

### Step 2: Create Page

Create a Page where:

* The Dynamic Form will be placed
* The metadata variable will be defined

 

### Step 3: Create Service Variable

Create a Service Variable (e.g., `MetadataVariable`) that:

* Calls the metadata API
* Stores the returned metadata
* Exposes metadata to the Form

This variable acts as the data source for the Form’s metadata property.

 

## Creating the Dynamic Form

### Configure Form Widget

1. Drag and drop the Form widget
2. Uncheck predefined Fields
3. Do not configure static fields

The Form must be metadata-driven.

 

### Bind Metadata to Form

In the Markup tab:

Replace dataset binding with metadata binding.

Replace:

```
dataset="bind:Variables.supportedLocale.dataSet"
```

With:

```
metadata="bind:Variables.MetadataVariable.dataSet"
```

This enables runtime field generation.

 

### Preview the Form

Once metadata is bound:

* Click Save
* Click Preview

The Form renders fields based on metadata.

 

## Modifying Metadata Before Render

If the metadata returned by the API does not match the expected structure, use the `on-beforerender` event.

Example:

```
on-beforerender="form1Beforerender($metadata, widget)"
```

This allows:

* Metadata transformation
* Field mapping adjustments
* Structural corrections

Before the Form renders.

This ensures:

* Backend flexibility
* Frontend stability
* Controlled adaptation

 

## Business User Configurable Forms

In some scenarios, Business Users may define or modify metadata through a Static Form.

In this case:

* Static Form captures metadata
* Metadata is stored or updated
* Dynamic Form consumes updated metadata

This enables:

* Non-developer customization
* Business-driven field control
* Reduced developer dependency



## Summary

Dynamic Forms in WaveMaker provide:

* Metadata-driven field generation
* Runtime layout and validation handling
* Clear separation between backend definitions and frontend rendering
* Flexible role-based and business-driven customization
* Controlled metadata transformation using lifecycle events

This architecture ensures that Forms are not statically built —
they are dynamically constructed on a governed, scalable metadata foundation.

