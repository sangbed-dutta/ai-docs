---
title: "Queries with Dynamic Where Clause – UI & Backend"
id: "queries-with-dynamic-where-clause"
last_update: { author: "Swetha Kundaram" }
---

Dynamic Where Clause enables queries to filter data based on runtime conditions.

Instead of hardcoding filter values inside a query, conditions are constructed dynamically using user inputs, variables, or business logic.

This approach ensures:

* Flexible data filtering
* Reduced query duplication
* Reusable query definitions
* Clean separation between UI inputs and backend execution

## What is a Dynamic Where Clause?

A Dynamic Where Clause allows query conditions to be applied at runtime.

The filtering logic is not fixed in the query definition. Instead, parameters are passed dynamically from:

* UI components
* Page variables
* Service variables
* Business logic

The query executes based on the supplied values.

## When to Use Dynamic Where Clause

Use dynamic conditions when:

* Search filters are user-driven
* Multiple combinations of filters are possible
* Role-based filtering is required
* Query logic must adapt without redeployment
* Avoiding multiple static queries for each condition

This prevents unnecessary duplication of database queries.


## Architecture Overview

Dynamic filtering involves two layers:

* UI Layer (Input Collection)
* Backend Layer (Query Execution)

### Runtime Flow

1. User enters filter values in UI
2. Variables capture input values
3. Query receives parameters
4. Dynamic Where Clause applies conditions
5. Filtered data is returned

This separates:

* Filter input
* Query logic
* Data retrieval

## Backend Configuration

Dynamic Where Clauses are defined in Database Queries using parameters.

### Example Scenario

Filter Employees based on:

* Department
* Role
* Minimum Salary

Instead of hardcoding values:

```
SELECT * FROM EMPLOYEE
WHERE deptId = :deptId
AND role = :role
AND salary >= :minSalary
```

The parameters (`:deptId`, `:role`, `:minSalary`) are resolved at runtime.

### Handling Optional Parameters

To make conditions optional, use conditional logic.

Example:

```
SELECT * FROM EMPLOYEE
WHERE (:deptId IS NULL OR deptId = :deptId)
AND (:role IS NULL OR role = :role)
AND (:minSalary IS NULL OR salary >= :minSalary)
```

This ensures:

* Filters apply only when values are provided
* Query remains reusable
* No need for multiple query versions


## UI Configuration

### Step 1: Create Input Fields

Add UI components:

* Select (Department)
* Select (Role)
* Input (Minimum Salary)

These capture filter values.


### Step 2: Create Service Variable

Create a Database CRUD or Query Variable bound to the dynamic query.

Bind query parameters to UI inputs.

Example:

```
deptId → bind:Widgets.departmentSelect.datavalue
role → bind:Widgets.roleSelect.datavalue
minSalary → bind:Widgets.salaryInput.datavalue
```

### Step 3: Enable Update Behavior

Enable:

* Update Data on Input Change

Or trigger manually via:

* Button click event

This ensures query execution when inputs change.

## How It Works Together

In Dynamic Where Clause implementation:

* UI collects filter inputs
* Variables pass parameters
* Query resolves conditions
* Database returns filtered dataset
* Data Table renders results

The query remains constant.
Only parameters change.

This architecture ensures:

* Single query definition
* Flexible runtime filtering
* Clear separation of concerns
* Controlled data retrieval

## Advanced Handling

Dynamic Where Clause can also be constructed programmatically.

Example:

```
Page.searchClick = function() {
    Page.Variables.EmployeeQuery.update();
};
```

Additional validation or preprocessing logic can be added before query execution.

## Summary

Queries with Dynamic Where Clause provide:

* Runtime-controlled filtering
* Parameter-driven query execution
* Optional condition handling
* UI-to-backend binding
* Reusable database queries

This approach ensures that filtering logic is not rigidly embedded —
it is dynamically constructed through governed parameter flow between UI and backend.


