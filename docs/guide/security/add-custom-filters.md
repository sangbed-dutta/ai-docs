---
title: "Add Custom Filters in a WaveMaker Application"
id: "add-custom-filters"
sidebar_label: "Add Custom Filters"
last_update: { author: "Venkateswarlu Kakani" }
---

## Overview

In WaveMaker applications, all incoming requests pass through a Spring Security **FilterChain** before reaching your application logic. This guide shows you how to create a custom filter, upload it to your project, register it as a Spring bean, and position it within the filter chain using `general-options.json`.

By the end of this guide, you will have a working custom filter that intercepts requests at a specific position in the security pipeline.

---

## Prerequisites

- A WaveMaker application with security enabled
- Basic understanding of Java and Spring Security
- Access to the following project files:
  - `src/main/webapp/WEB-INF/project-user-spring.xml`
  - `services/securityService/designtime/general-options.json`

---

## How the Filter Chain Works

Spring Security processes every incoming request through a **FilterChain** — an ordered sequence of filters, each responsible for a specific task such as authentication, CSRF protection, or session management.

WaveMaker exposes a `customFilterList` in `general-options.json` that lets you inject your own filters into this chain at a precise position, without modifying WaveMaker's internal security configuration.

:::note
Custom filters added via `customFilterList` are applied on every incoming HTTP request. Keep your filter logic lightweight to avoid performance impact.
:::

---

## Step 1 — Create the Custom Filter Class

Create a Java class that implements the `jakarta.servlet.Filter` interface. The `doFilter` method is where your custom logic runs for every request.

```java
package com.filters;

import jakarta.servlet.*;
import java.io.IOException;

public class CustomFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Optional initialization logic
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Add your custom logic here (e.g., logging, header validation)

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Optional cleanup logic
    }
}
```

:::tip
Always call `chain.doFilter(request, response)` at the end of `doFilter`. Omitting this call stops request processing and blocks all subsequent filters.
:::

---

## Step 2 — Upload the Filter to Your Project

Upload the `.java` file to the correct location using the **Import Resource** dialog in WaveMaker Studio.

1. Open **Import Resource** from the studio toolbar.
2. Select the **Project** tab on the left.
3. Navigate to `src > main > java > com > filters`.
4. Upload your `CustomFilter.java` file.
5. Click **Import** to confirm.

{/* TODO: Add screenshot — Import Resource dialog showing CustomFilter.java placed at src/main/java/com/filters */}

After upload, the file is available at `../project/src/main/java/com/filters/CustomFilter.java` within your project structure.

---

## Step 3 — Register the Filter as a Spring Bean

Open `src/main/webapp/WEB-INF/project-user-spring.xml` and declare your filter class as a Spring bean.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="com.filters.CustomFilter" id="customFilter"/>

</beans>
```

{/* TODO: Add screenshot — project-user-spring.xml showing the CustomFilter bean declaration */}

:::note
`project-user-spring.xml` is never modified by WaveMaker itself — it is the designated file for all custom Spring bean declarations.
:::

---

## Step 4 — Configure the Filter in `general-options.json`

Open `services/securityService/designtime/general-options.json` and add an entry to the `customFilterList` array.

```json
"customFilterList": [
  {
    "name": "customFilter",
    "ref": "customFilter",
    "position": "<Filter position enum>"
  }
]
```

| Field | Description |
|---|---|
| `name` | A human-readable label for this filter entry |
| `ref` | The `id` of the Spring bean declared in `project-user-spring.xml` |
| `position` | The Spring Security filter position where this filter is inserted |

{/* TODO: Add screenshot — general-options.json showing the customFilterList entry with name, ref, and position fields */}

### Filter Position Reference

The `position` field accepts a value from Spring Security's filter ordering enum. Choose based on where in the pipeline your logic needs to run:

| Position | When it runs |
|---|---|
| `FIRST` | Before all other filters |
| `CORS_FILTER` | After CORS processing |
| `CSRF_FILTER` | After CSRF protection |
| `LOGOUT_FILTER` | After the logout filter |
| `FORM_LOGIN_FILTER` | After form-based login processing |
| `BASIC_AUTH_FILTER` | After HTTP Basic authentication |
| `SESSION_MANAGEMENT_FILTER` | After session management |
| `EXCEPTION_TRANSLATION_FILTER` | After security exception translation |
| `FILTER_SECURITY_INTERCEPTOR` | After authorization decisions |
| `LAST` | After all other filters |

:::warning
Positioning your filter at `FIRST` means the security context may not yet be populated. Only access `SecurityContextHolder` from positions at or after `SECURITY_CONTEXT_FILTER`.
:::

---

## Limitations and Constraints

| Constraint | Details |
|---|---|
| All HTTP requests affected | The filter runs on every incoming request — add path-based checks inside `doFilter` if you need to skip specific endpoints |
| Spring bean registration required | Filters must be declared in `project-user-spring.xml`; annotation-based scanning alone is not sufficient |

---

## See Also

- [Customize Post-Authentication Handlers](./customizing-post-authentication-handlers)
