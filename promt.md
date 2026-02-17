I want you to create a simple project in which I will create simple visualization games for solving mathematical problems. I want the user to interact through a browser, and I would host it in docker.

On the main page of the application being launched, we select one of the prepared task games.

The first game task is aimed at solving an equation of the form `k*x + m = z`, where
'x` is the desired value (the value varies from 1 to 9)
`k` is the multiplier of `x` (the value varies from 2 to 5)
`m` is the free term (the value varies from 3 to 7)
'z` is the result of calculating an example with generated numbers.

At the start of the game session, values in the specified ranges are generated, for example: 

`k = 3`, `x = 5`, `m = 7`, hence `z = 22`. We generate an example of the form:
`x + x + x + 7 = 22` (note that we expand `k*x` to the form of adding the value of `x` `k` times).

At the top of the page we display:
``
x + x + x + 7 = 22
x = ?
``

since this is a game, instead of `x` we draw some kind of object, for example, a ball (or a watermelon, or a car, or some other simple object)

The game itself aims to balance the scales.
The left scale shows `k` objects (in this example, 3 balls) and a weight of `m` (in this case 7) or several weights with a total weight of `m`. On the right side of the scale, several weights are displayed, with a total weight of `z` (in this example, 22), and some of these weights weigh `m` (in this case, 7).

Every time we remove the weights from one of the scales, the position of the scales relative to each other changes. 

At the start of the scene, the scales are in balance.

We guide the user step by step. Until the step is completed completely, we don't move on to the next one.

Step 1. "Remove all the weights from the left scale" (where the objects `x` are located, for example, balls). When we remove the weights from the left bowl, we show how much the weight of the objects on the left bowl has changed.
Since we removed the weights from the left side of the scale, the left side goes up and the right side goes down.

Step 2.
"Remove the weights from the right side of the scale so that the scales come into balance."
We allow the user to remove weights from the right bowl (and return the removed weights back to the right bowl of the scale). Each time the user removes or returns the weights to the right side of the scale, the position of the scales changes: if we remove the weights from the right side, the right side rises (and the left side falls); when we return the weights to the right side, the right side falls (and the left side rises). If we remove too much weight from the right bowl (for example, all the kettlebells), then the right bowl rises above the left. As soon as the same weight is removed from the right bowl as in Step1 from the left, then proceed to Step3.

Step3.
"How much does one `x` weigh?" (where `x` is an object of the game, for example, a ball).
The user enters a value (from 1 to 9) in the provided window. The entered value will be referred to as `y'. Go to Step4.

Step4. "Check: `y + y + y = ?`", where `y` is the estimated weight of the object `x`, and it is repeated in the example `k` times.
The user is given the opportunity to specify in the window what `k*y` is equal to. Save the entered value in the variable `z1`. If `k*y = z1`, and `z1 = z - m`, and `y = x`, then proceed to Step5.
If `k*y != z1`, then we highlight the window for entering the value `z1` and indicate that the solution of the example is incorrect. We are waiting for the user to enter the correct value of `z1`.
If the user entered the correct value of `z1` (`k*y = z1`), but `y != x`, then we inform the user that an incorrect value of `x` has been entered and return the user to Step3.

Step5.
"Hooray, you solved the equation correctly! x = y", where `x` is the item whose weight we were looking for, and `y` is the found weight entered in Step3.