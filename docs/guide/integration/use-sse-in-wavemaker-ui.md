---
title: "Handle SSE Events in WaveMaker Page Scripts"
id: "use-sse-in-wavemaker-ui"
sidebar_label: "Handle SSE Events"
last_update: { author: "Raj Kumar Reddy" }
---

## Overview

Server-Sent Events (SSE) let your WaveMaker app receive a continuous stream of live updates from a server over a single HTTP connection — without polling. Because WaveMaker does not support SSE-driven variables natively, you manage SSE connections entirely in page script using the browser's built-in `EventSource` API. This guide covers the SSE lifecycle, connection state handling, and a step-by-step working implementation in a WaveMaker page.

---

## Prerequisites

Before you begin, make sure you have:

- A backend SSE endpoint already available and accessible from your app
- Familiarity with WaveMaker page scripting (JavaScript in the **Script** tab)

---

## When to Use SSE in WaveMaker UI

SSE is a good fit for UI scenarios where the server needs to push continuous, one-directional updates to the page without the client polling repeatedly. Common use cases in WaveMaker apps include:

- **Background job monitoring** — track the progress of long-running server tasks such as code generation, imports, or exports
- **Live status updates** — show real-time status changes such as build pipeline stages or deployment steps
- **Preview generation** — receive page-by-page or step-by-step generation progress as it happens
- **Notification feeds** — display live alerts or system messages as they arrive from the server

Use SSE when your data flows in one direction (server → client) and you expect a stream of updates over time rather than a single response.

---

## SSE Basics in JavaScript

The browser's `EventSource` API opens a persistent HTTP connection to a URL and listens for messages the server pushes. Here is the basic structure:

```javascript
// 1. Open a connection
const eventSource = new EventSource("https://your-api/stream");

// 2. Connection opened
eventSource.onopen = function() {
    console.log("SSE connection is open");
};

// 3. Message received
eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);
};

// 4. Error
eventSource.onerror = function() {
    console.error("SSE error, readyState:", eventSource.readyState);
};

// 5. Close when done
eventSource.close();
```

The browser automatically attempts to reconnect after a network interruption. You close the connection yourself with `eventSource.close()` once the stream is no longer needed.

---

## SSE Lifecycle on the UI Side

When you create an `EventSource`, it moves through these stages:

1. **Connection created** — `new EventSource(url)` is called; the browser sends the HTTP request.
2. **Connection opened** — The server accepts and holds the connection; `onopen` fires.
3. **Messages received** — The server pushes data chunks; `onmessage` fires for each one.
4. **Error or reconnect** — If the connection drops, the browser retries automatically. `onerror` fires; check `readyState` to decide how to respond.
5. **Connection closed** — You call `eventSource.close()` when the stream is complete, or the server ends it.

---

## SSE Connection States

`EventSource.readyState` gives you the current transport state of the connection:

| Value | Constant                 | Meaning                                                          |
| ----- | ------------------------ | ---------------------------------------------------------------- |
| `0`   | `EventSource.CONNECTING` | The connection is being established or reconnecting after a drop |
| `1`   | `EventSource.OPEN`       | The connection is active and receiving messages                  |
| `2`   | `EventSource.CLOSED`     | The connection has been closed and will not reconnect            |

---

## How to Implement SSE in a WaveMaker Page Script

Because WaveMaker does not provide an SSE Variable type, you manage the `EventSource` directly in the page's JavaScript. Follow this pattern:

1. **Declare a module-level variable** — store the `EventSource` instance outside any method so it persists and can be closed from anywhere in the page.
2. **Wrap the connection in a page method** — this keeps the logic reusable and callable from multiple places.
3. **Start the stream from `Page.onReady`** — if the page should begin receiving updates as soon as it loads, call your method from `onReady`. Otherwise, call it from a button click or any other event handler.
4. **Update Variables and Widgets inside `onmessage`** — use incoming data to update `App.Variables`, `Page.Variables`, or widget `dataset` properties directly; WaveMaker re-renders widgets automatically.
5. **Close the connection when done** — call `eventSource.close()` once you have received the final expected update or when the user navigates away.

---

## Working Example: Streaming Order Status Updates

The following example shows how to use Server-Sent Events (SSE) on the UI side in WaveMaker to receive live updates for multiple orders.\
The server sends incremental updates, and the UI merges them into the existing dataset and refreshes the list widget in real time.\
Once all orders reach a terminal state, the SSE connection is closed.

---

### Step 1 — Declare the `eventSource` variable at module scope

```javascript
let eventSource = null;
```

### Step 2 — Start the stream on page load

```javascript
Page.onReady = function() {
    Page.startOrderStatusStream();
};
```

`Page.onReady` is a good place to start the stream when updates should begin immediately after the page loads.

If the stream should start only after a user action, call Page.startOrderStatusStream() from the appropriate event handler instead.

### Step 3 — Build the SSE URL and open the connection

```javascript
Page.startOrderStatusStream = function() {
    const sseUrl = "https://your-api/stream";
    eventSource = new EventSource(sseUrl);
};
```

`new EventSource(sseUrl)` creates the SSE connection and starts listening for updates.

### Step 4 — Handle onopen

```javascript
    eventSource.onopen = function() {
        console.log("Connected to order status stream");
    };
```

`onopen` is triggered when the connection is successfully established.

You can use it to log connection status, show a loading indicator, or disable actions until updates begin.

### Step 5 — Handle onmessage and update the UI

```javascript
    eventSource.onmessage = function(event) {

        const data = JSON.parse(event.data);
        let orders = App.Variables.orderList.dataSet || [];

        orders.forEach(function(order) {
            const update = data.orderUpdates[order.orderId];

            if (update) {
                order.state   = update.state;
                order.status  = update.status;
                order.message = update.message;
            }
        });

        App.Variables.orderList.dataSet = orders;
        Page.Widgets.orderListWidget.dataset = orders;
```

Each time the server pushes a new update:

- The payload is read from `event.data`
- The JSON string is parsed into an object
- Matching order entries are updated with the latest values
- The updated array is assigned back to the WaveMaker Variable
- The list widget dataset is refreshed so the UI shows the latest state

A typical payload may look like this:

```JSON
{
  "orderUpdates": {
    "ORD-1001": {
      "state": "PROCESSING",
      "status": "IN_PROGRESS",
      "message": "Packaging is in progress"
    },
    "ORD-1002": {
      "state": "SHIPPED",
      "status": "COMPLETED",
      "message": "Order has been shipped"
    }
  }
}
```

### Step 6 — Check for terminal state and close the connection

```javascript
        const isAllOrdersFinal = orders.every(function(order) {
            return ["SHIPPED", "CANCELLED"].includes(order.state) &&
                   ["COMPLETED", "FAILED"].includes(order.status);
        });
        if (!isAllOrdersFinal) {
            return;
        }
        const isAnyFailed = orders.some(function(order) {
            return order.status === "FAILED";
        });

        if (isAnyFailed) {
            Page.Actions.showOrderError.invoke();
        }
        eventSource.close();
    };
```

This logic checks whether all streamed items have reached a terminal state.

In this example:

- `SHIPPED` and `CANCELLED` are treated as final business states
- `COMPLETED` and `FAILED` are treated as final processing statuses

If all orders are not yet complete, the method returns and waits for the next SSE message.

Once all orders are final:

A failure action is triggered if any order failed
The SSE connection is closed because no more updates are needed

### Step 7 — Handle onerror and reconnect if required

```javascript
eventSource.onerror = function() {
    if (eventSource.readyState === EventSource.CLOSED) {
            let orders = App.Variables.orderList.dataSet || [];
            const isAllOrdersFinal = orders.every(function(order) {
                return ["SHIPPED", "CANCELLED"].includes(order.state) &&
                       ["COMPLETED", "FAILED"].includes(order.status);
            });

            if (!isAllOrdersFinal) {
                eventSource = null;
                Page.startOrderStatusStream();
            }
        }
    };
};
```

`onerror` is triggered when the connection encounters a problem.

This example reconnects only when:

- the connection is fully closed, and
- the business process is still incomplete

This prevents unnecessary reconnect attempts after all work is already done.
