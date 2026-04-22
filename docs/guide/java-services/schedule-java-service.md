---
title: "Schedule a Java Service in WaveMaker"
id: "schedule-java-service"
sidebar_label: "Schedule a Java Service"
last_update: { author: "Priyanka Bhadri"}
---

## Overview

WaveMaker lets you run backend Java logic automatically at defined time intervals using Spring Scheduler. This guide walks you through creating a schedulable Java Service, configuring it as a Spring bean, and setting a cron expression to control when it runs.

---

## Prerequisites

Before you begin, make sure you have:

- A WaveMaker project open in WaveMaker Studio
- Basic familiarity with Java Services in WaveMaker
- The method you want to schedule already defined in your Java Service

---

## Create a Java Service

1. In your WaveMaker project, navigate to **File Explorer > src/main/java** and open or create your Java Service class.
2. Define the method you want to schedule. The method must be `public` and return `void` or a serializable type.

```java
package com.example.simplejavaservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.wavemaker.runtime.service.annotations.ExposeToClient;

@ExposeToClient
public class SimpleJavaService {

    private static final Logger logger = LoggerFactory.getLogger(SimpleJavaService.class);

    public String sampleJavaOperation() {
        logger.warn("Starting sample operation");
        String result = "HELLO SERVICE!";
        logger.warn("Returning {}", result);
        return result;
    }
}
```

---

## Configure Spring Scheduler

1. Open `project-user-spring.xml` from **File Explorer > src/main/webapp/WEB-INF/**.
2. Add the Spring `task` namespace to the `<beans>` declaration.
3. Register your Java Service as a Spring bean and define the scheduled task:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:task="http://www.springframework.org/schema/task"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/task
           http://www.springframework.org/schema/task/spring-task.xsd">

    <bean id="SimpleJavaService"
          class="com.example.simplejavaservice.SimpleJavaService"
          scope="singleton"
          lazy-init="true" />

    <task:scheduled-tasks>
        <task:scheduled
            ref="SimpleJavaService"
            method="sampleJavaOperation"
            cron="*/10 * * * * ?" />
    </task:scheduled-tasks>

</beans>
```

:::note
The `ref` value must match the `id` of the bean you defined. The `method` value must exactly match the method name in your Java Service class.
:::

---

## Enable the Scheduler

Add the following lines inside the same `<beans>` block to activate Spring's scheduling engine:

```xml
<task:annotation-driven scheduler="taskScheduler"/>
<task:scheduler id="taskScheduler" pool-size="5"/>
```

Adjust `pool-size` based on how many concurrent scheduled tasks your application needs.

---

## Understanding Cron Expressions

Spring Scheduler uses a six-field cron format:

```
Seconds   Minutes   Hours   Day-of-Month   Month   Day-of-Week
```

| Example | Meaning |
|---|---|
| `*/10 * * * * ?` | Every 10 seconds |
| `0 */5 * * * ?` | Every 5 minutes |
| `0 0 9 * * MON-FRI` | Every weekday at 9:00 AM |
| `0 0 0 1 * ?` | First day of every month at midnight |

---

## Schedule Multiple Services

To schedule more than one service, register each as a bean and add separate `<task:scheduled-tasks>` blocks:

```xml
<bean id="ServiceOne" class="com.example.ServiceOne"/>
<bean id="ServiceTwo" class="com.example.ServiceTwo"/>

<task:scheduled-tasks>
    <task:scheduled ref="ServiceOne" method="methodOne" cron="*/10 * * * * ?" />
</task:scheduled-tasks>

<task:scheduled-tasks>
    <task:scheduled ref="ServiceTwo" method="methodTwo" cron="*/20 * * * * ?" />
</task:scheduled-tasks>
```

---

## Conclusion

You have successfully configured a Java Service to run on a schedule using Spring Scheduler in WaveMaker. With cron expressions, you can control execution timing precisely — from every few seconds to monthly jobs. As your application grows, you can register additional beans and extend the scheduler to handle multiple background tasks independently.

---

## See Also

- [Store Credentials with Secure Store](../react-native/store-credentials-with-secure-store.md)
- [Customize Post-Authentication Handlers](../security/customizing-post-authentication-handlers.md)
