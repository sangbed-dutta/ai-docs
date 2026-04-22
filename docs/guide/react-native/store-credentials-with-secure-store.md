---
title: "Use Storage Services in React Native"
id: "store-credentials-with-secure-store"
sidebar_label: "Storage Services"
last_update: { author: "Mayank Prakash" }
---

## Overview

WaveMaker React Native apps provide two built-in services for persisting data locally on the device: `StorageService` for general app data, and `SecureStorageService` for sensitive information such as passwords and authentication tokens. This guide covers how to use both services and walks through a complete "Remember Me" implementation using `SecureStorageService`.

---

## Choosing the Right Service

| Use Case                                        | Recommended Service    |
| ----------------------------------------------- | ---------------------- |
| User preferences, app flags, cached responses   | `StorageService`       |
| Tokens, passwords, secrets, sensitive user data | `SecureStorageService` |

---

## StorageService

`StorageService` is built on `@react-native-async-storage/async-storage` and is recommended for storing general, non-sensitive data.

### Supported Methods

| Method                | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| `setItem(key, value)` | Stores the value under the given key. Returns `Promise<void>`.                |
| `getItem(key)`        | Retrieves the value for the given key. Returns `Promise<string \| null>`.     |
| `removeItem(key)`     | Removes the value for the given key. Returns `Promise<void>`.                 |
| `getAll()`            | Retrieves all stored key-value pairs as an object. Returns `Promise<object>`. |

```javascript
// Add
App.getDependency('StorageService').setItem("theme", "dark");

// Retrieve
const theme = await App.getDependency('StorageService').getItem("theme");

// Delete
App.getDependency('StorageService').removeItem("theme");

// Retrieve all
const all = await App.getDependency('StorageService').getAll();
```

---

## SecureStorageService

`SecureStorageService` uses `expo-secure-store` under the hood, which maps to iOS Keychain and Android Keystore. Use it for any data you would not want exposed if the device were compromised.

:::note
`SecureStorageService` supports a maximum of **4 KB per key**. It is not suitable for large datasets.
:::

### Supported Methods

| Method                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `setItem(key, value)` | Stores the value securely under the given key. Returns `Promise<void>`. |
| `getItem(key)`        | Retrieves a securely stored value. Returns `Promise<string \| null>`.   |
| `removeItem(key)`     | Removes a securely stored value. Returns `Promise<void>`.               |

:::note
Unlike `StorageService`, `getAll()` is not available in `SecureStorageService`.
:::

`getItem` returns `null` if the key does not exist — always guard against this before parsing the result.

```javascript
// Add
App.getDependency('SecureStorageService').setItem("authToken", "abc123");

// Retrieve — guard against null on first run
const token = await App.getDependency('SecureStorageService').getItem("authToken");
if (!token) return;

// Delete
App.getDependency('SecureStorageService').removeItem("authToken");
```

---

## Use-Case: Remember Me on the Login Page

This section shows how to save and restore login credentials when a user checks "Remember Me."

### Prerequisites

Before you begin, make sure you have:

- A WaveMaker React Native project
- A login page with username and password input fields (required for the Remember Me use-case)

### Add a Remember Me checkbox

In your `Pages/Login` page markup, add a checkbox widget:

```javascript
<wm-checkbox caption="Remember me" name="rememberme" on-change="remembermeChange($event, widget, newVal, oldVal)">
</wm-checkbox>
```

### Save credentials on checkbox change

Create a `remembermeChange` handler that stores the current credentials when the checkbox is checked. The `setTimeout` gives the form widgets time to reflect the latest input values before reading them:

```javascript
Page.remembermeChange = async function($event, widget, newVal, oldVal) {
    if (newVal) {
        setTimeout(async () => {
            const username = Page.Widgets.loggedInUserForm1.formWidgets.j_username.datavalue;
            const password = Page.Widgets.loggedInUserForm1.formWidgets.j_password.datavalue;

            const auth = { username, password };
            await App.getDependency('SecureStorageService').setItem('auth', JSON.stringify(auth));
        }, 400);
    }
};
```

### Restore credentials on page load

In `Page.onReady`, retrieve stored credentials and pre-fill the form:

```javascript
Page.onReady = async function() {
    const res = await App.getDependency('SecureStorageService').getItem('auth');
    if (!res) return;

    const auth = JSON.parse(res);
    if (auth.username && auth.password) {
        Page.Widgets.loggedInUserForm1.formWidgets.j_username.datavalue = auth.username;
        Page.Widgets.loggedInUserForm1.formWidgets.j_password.datavalue = auth.password;
    }
};
```

:::warning
Storing plaintext passwords in `SecureStore` protects against external access but does not protect against a compromised device. Evaluate your app's security requirements before implementing credential persistence.
:::
