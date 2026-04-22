---
title: "Set Custom Status Codes and Error Messages in a Java Service"
id: "custom-status-code-and-error-message"
sidebar_label: "Custom Status Codes & Error Messages"
last_update: { author: "Sangbed Dutta" }
---

## Overview

WaveMaker Java Services let you take full control of API responses by returning custom HTTP status codes and meaningful error messages. This guide shows you how to use `HttpServletResponse` to set a status code and `WMRuntimeException` with `MessageResource` to throw structured error messages from your Java service.

---

## Prerequisites

Before you begin, make sure you have:

- A WaveMaker project with at least one Java service created
- Basic familiarity with Java and WaveMaker's Java service structure

---

## Set a Custom HTTP Status Code

Use `HttpServletResponse` to explicitly control the HTTP status code returned by your service method.

### Import the Required Classes

Add the following imports to your Java service file:

```java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
```

### Implementation

Inject `HttpServletRequest` and `HttpServletResponse` as method parameters and call `response.setStatus()` with the desired code:

```java
public String sampleJavaOperation(String name,
                                  HttpServletRequest request,
                                  HttpServletResponse response) {

    logger.info("Starting sample operation with request url "
                + request.getRequestURL().toString());

    // Set HTTP status code to 400 (Bad Request)
    response.setStatus(400);

    return null;
}
```

:::tip
Replace `400` with any valid HTTP status code that fits your use case — for example, `401` for unauthorized access, `422` for validation failures, or `200` for explicit success signaling.
:::

---

## Throw a Custom Error Message

Use `WMRuntimeException` together with `MessageResource` to return structured, meaningful error messages when a request fails.

### Import the Required Classes

```java
import com.wavemaker.commons.MessageResource;
import com.wavemaker.commons.WMRuntimeException;
```

### Implementation

Wrap your logic in a try-catch block and throw a `WMRuntimeException` with a `MessageResource` in the catch:

```java
public User getUserById(Integer userId) {
    try {
        User user = userService.getById(userId);
        return user;

    } catch (Exception e) {
        throw new WMRuntimeException(
            MessageResource.create("MESSAGE_USER_NOT_FOUND")
        );
    }
}
```

:::note
`MessageResource.create()` accepts either a **message key** (e.g., `"MESSAGE_USER_NOT_FOUND"`) or a **plain string message**. Using message keys is recommended when you want to support localization or centrally manage error strings.
:::
