---
title: "Integrate Flyway for Database Migration in WaveMaker"
id: "integrate-flyway-wavemaker"
sidebar_label: "Flyway Integration"
last_update: { author: "Venkateswarlu Kakani" }
---

## Overview

In this guide, you will learn how to integrate Flyway into a WaveMaker application to manage database schema migrations in a version-controlled and automated way. Flyway tracks, versions, and applies database changes consistently across environments, ensuring your database evolves in step with your application code.

---

## What is Flyway?

Flyway is an open-source database migration tool that enables version-based schema management.

- Licensed under Apache License 2.0
- Supports SQL and Java-based migrations
- Automatically applies database changes in a controlled manner

It ensures your database structure stays in sync with your application across environments.

---

## Why Use Flyway in WaveMaker

Managing database changes manually in real-world applications leads to issues such as:

- Difficulty tracking what changed and when
- Inconsistent schemas across dev, QA, and prod environments
- Risk of missing or duplicating updates
- Challenges setting up fresh environments from scratch

Flyway solves these by versioning every database change, maintaining a full migration history, automating schema updates on startup, and making team collaboration on schema changes straightforward.

---

## How Flyway Works

Flyway scans a designated folder for migration scripts, sorts them by version, and applies only the ones that have not yet run against the target database.

| Concept | Description |
|---|---|
| Migration Scripts | SQL or Java files defining one database change each |
| Versioning | Ensures migrations execute in a predictable, ordered sequence |
| Schema History | `flyway_schema_history` table tracks every applied migration |

---

## Prerequisites

- A WaveMaker application with a configured database service
- Access to `pom.xml` and `src/main/webapp/WEB-INF/project-user-spring.xml`
- Basic familiarity with SQL and Spring bean configuration

---

## Step 1 — Add the Flyway Dependency

Open `pom.xml` in your WaveMaker project and add the Flyway dependency inside the `<dependencies>` block:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

:::note
WaveMaker manages the version of `flyway-core` through its parent BOM. Do not specify a `<version>` unless you need to override it for a specific reason.
:::

---

## Step 2 — Create Migration Scripts

Place your SQL migration scripts in the following folder within your project:

```
src/main/resources/db/migration/
```

### Naming Convention

Flyway uses a strict naming convention to identify, version, and order migration scripts:

```
{Prefix}{Version}__{Description}.sql
```

{/* TODO: Add screenshot — Flyway naming convention diagram showing V prefix, version number, __ separator, description, and .sql suffix */}

| Part | Description | Example |
|---|---|---|
| Prefix | `V` for versioned, `R` for repeatable | `V` |
| Version | Numeric version; supports dot notation for sub-versions | `1`, `2`, `2.1` |
| Separator | Two underscores (`__`) | `__` |
| Description | Human-readable label; underscores render as spaces | `Add_new_table` |
| Extension | `.sql` for SQL scripts | `.sql` |

### Example File Structure

```
src/
└── main/
    └── resources/
        └── db/
            └── migration/
                ├── R__Launchup_Data.sql
                ├── V1__Setup_Schema.sql
                ├── V2__Set_Sport_Data.sql
                └── V3__New_Column_In_Sport.sql
```

:::tip
Use the `R__` (repeatable) prefix for scripts that should re-run whenever their content changes, such as reference data or views. Use `V__` (versioned) for one-time structural changes like table creation or column additions.
:::

---

## Step 3 — Configure Flyway in Spring

Open `src/main/webapp/WEB-INF/project-user-spring.xml` and add the Flyway bean. Then update your Hibernate session factory bean to declare a dependency on Flyway so it initializes only after all migrations have run.

```xml
<!-- Flyway configuration -->
<bean id="flyway" class="org.flywaydb.core.Flyway" init-method="migrate">
    <property name="locations" value="classpath:db/migration"/>
    <property name="dataSource" ref="flywaydemodbDataSource"/>
    <property name="validateOnMigrate" value="false"/>
    <property name="baselineOnMigrate" value="true"/>
</bean>

<!-- The rest of the application (incl. Hibernate) -->
<!-- Must be run after Flyway to ensure the database is compatible with the code -->
<bean id="flywaydemodbSessionFactory"
      class="org.springframework.orm.hibernate5.LocalSessionFactoryBean"
      depends-on="flyway">
    <property name="dataSource" ref="flywaydemodbDataSource"/>
    ...
</bean>
```

{/* TODO: Add screenshot — project-user-spring.xml showing the Flyway bean and the session factory bean with depends-on="flyway" */}

| Property | Description |
|---|---|
| `locations` | Classpath path to your migration scripts folder |
| `dataSource` | Spring bean ID of your WaveMaker database data source |
| `validateOnMigrate` | Set to `false` to skip checksum validation on each startup |
| `baselineOnMigrate` | Set to `true` to baseline an existing non-empty database on first run |

:::warning
Replace `flywaydemodbDataSource` with the actual bean ID of your WaveMaker database's data source. You can find this in the generated Spring configuration for your database service.
:::

:::note
The `depends-on="flyway"` attribute on the session factory guarantees that Flyway applies all pending migrations before Hibernate initializes — preventing Hibernate from validating a schema that has not yet been migrated.
:::

---

## Step 4 — Run the Application and Verify Migrations

Start your WaveMaker application. Flyway runs automatically at startup via `init-method="migrate"` on the Flyway bean.

To confirm all migrations were applied:

1. Connect to your database using a SQL client.
2. Query the schema history table:

```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

A successful run produces records similar to the following:

| installed_rank | version | description | type | script | success |
|---|---|---|---|---|---|
| 1 | 1 | Initial Setup | SQL | V1__Initial_Setup.sql | true |
| 2 | 2 | First Changes | SQL | V2__First_Changes.sql | true |
| 3 | 2.1 | Refactoring | JDBC | V2_1__Refactoring | true |

Each row represents a migration that was applied, along with its version, description, and execution status.

---

## Limitations and Constraints

| Constraint | Details |
|---|---|
| No rollback in Community Edition | Flyway Community Edition does not support undo migrations — design scripts to be forward-only |
| Checksum protection on versioned scripts | Modifying an already-applied versioned script causes a checksum failure on the next startup; disable with `validateOnMigrate: false` only during active development |
| Version numbers are reserved once used | After a versioned script is applied, its version number is permanently reserved — you cannot backfill a lower-versioned script later |

---

## See Also

- [Upload a JDBC Driver](./upload-jdbc-driver.md)
- [Schedule a Java Service](../java-services/schedule-java-service.md)
- [Add Custom Filters in a WaveMaker Application](../security/add-custom-filters.md)
