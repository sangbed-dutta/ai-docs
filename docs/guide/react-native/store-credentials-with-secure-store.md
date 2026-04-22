---
title: "Store Credentials Securely with SecureStore"
id: "store-credentials-with-secure-store"
sidebar_label: "Secure Store"
last_update: { author: "Mayank Prakash" }
---

## Overview

WaveMaker React Native apps include a built-in `SecureStorageService` that stores sensitive data — such as passwords and authentication tokens — in the device's native secure storage (iOS Keychain on iOS, Keystore on Android). This guide covers the three core API methods and walks through a complete "Remember Me" implementation for a login page.

---

## Prerequisites

Before you begin, make sure you have:

- A WaveMaker React Native project
- A login page with username and password input fields (required for the Remember Me use-case)

---

## Add, Retrieve, and Delete Items

### Add an item

Use `setItem(key, value)` to store a string value under a key:

```javascript
App.getDependency('SecureStorageService').setItem("superHero", "Batman");
```

### Retrieve an item

Use `getItem(key)` to retrieve a stored value. It returns a `Promise<string | null>` — `null` if the key does not exist:

```javascript
App.getDependency('SecureStorageService').getItem("superHero");
```

### Delete an item

Use `removeItem(key)` to delete a stored value:

```javascript
App.getDependency('SecureStorageService').removeItem("superHero");
```

---

## Use-Case: Remember Me on the Login Page

This section shows how to save and restore login credentials when a user checks "Remember Me."

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

In `Page.onReady`, retrieve stored credentials and pre-fill the form. Guard against a `null` return — `getItem` returns `null` on first run when nothing has been stored yet:

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
Storing plaintext passwords in SecureStore protects against external access but does not protect against a compromised device. Evaluate your app's security requirements before implementing credential persistence.
:::

---

## Limitations and Constraints

| Constraint   | Details                                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storage size | Maximum **4 KB per key**. Not suitable for large payloads.                                                                                                                         |
| `getAll()`   | Not available in `SecureStorageService`. Use [`StorageService`](../../../docs/guide/react-native/store-credentials-with-secure-store.md) if you need to enumerate all stored keys. |
| Return type  | `getItem` returns `Promise<string \| null>`. Always check for `null` before parsing.                                                                                               |

---

## See Also

- [Storage Service](/learn/react-native/storage-service-usage/) — Overview of both `StorageService` and `SecureStorageService`, and guidance on choosing between them
