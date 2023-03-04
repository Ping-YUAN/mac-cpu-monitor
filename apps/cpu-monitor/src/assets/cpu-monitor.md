### CPU Monitor Dashboard

This is a dashboard for **administrators** who would like to see the **performance of one servers**.

The dashboard supports monitor for **multiple server**. Check the server readme for more info about how to configure it and how it works.

In the dashboard, user can choose the server to check details according to the server host name and server system type.

The dashboard will then load some server info and start to show the **real time** updated **cpu load**. User can set a warning bound so that user can get **notifications** in the activity list in case the cpu load index reach the limit.

You can the means of the figures and icons below. You can also hover and check the tooltips.

## Prerequirement

What's the cpu load?

It refers to the number of processes which are either currently being executed by the CPU or are waiting for execution. An idle system has a load of 0. With each process that is being executed or is on the waitlist, the load increases by 1.

The CPU load is used by Linux users to keep track of system resources. It also helps you monitor how the system resources are engaged.
However, on its own, the load doesn’t give any useful information to the user. You need to combine other figures to better understand if you need to perform any action on the server.

## CPU Info

Figures Explain

| Terms                | Description                                           |
| -------------------- | ----------------------------------------------------- |
| **Load Index**       | A normalized cpu load                                 |
| **OverLoad Count**   | how many times the cpu load reach the warning bound   |
| **OverLoad Minutes** | how many minutes the cpu load reach the warning bound |
| **CPUs**             | how many cpus in this server                          |
| **RT Load**          | Real time cpu load                                    |

## CPU Chart

The chart will only display the last 10mins CPU load per 10 seconds.
The orange area means the high load. Once the load reach that area, a notificatin will display at the activity list to let user know.

User can set the warning cpu load bound by clicking the activity setting button.

## CPU Actitivity

Display the cpu overload activities such as: Start to listen/ Overload/ Recover/ Lost connection.

## What's the next?

1. This project as a poc more focus on if it works than it works perfect. So next need to think difference use case and check if we support it or not.
2. bugfix && test.
3. improve UI/UX.
4. authentication
5. export activities in a excel for more analysis.
6. automatic notification email to admin.
7. more functions.
8. backend api security
