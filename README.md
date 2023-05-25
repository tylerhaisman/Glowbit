# Glowbit

Welcome to Glowbit! My name is Tyler Haisman and I look foward to walking you through the game's features.

## About The Game
After completing Data Structures and Algorithms in Spring 2023, I wanted to see how I could implement some of the programming concepts I learned into some sort of web application. I made this game in an effort to make dynamic programming concepts into a challenging logic game.

Additionally, I made this game to introduce myself to the React JS library which I have since improved in and even implemented into other apps!

## How To Play
The object of Glowbit is to connect the upper leftmost node with the lower rightmost node with the continuous path with the greatest sum.

A user "wins" when the program detects that the user used the most optimal path between the two nodes summing to the greatest number out of all of the paths. Keep in mind that there can be more than one correct path! 

Additionally each move a user makes must be one node directly below or to the right of the current node.

### Step 1:
Start with the upper leftmost node (it will be slowly blinking). Click on that node.

### Step 2:
After clicking on the first node, you will see it stop blinking, and the nodes directly beneath and to the right of that node slowly blinking. You may click on either of these nodes to proceed.

### Step 3:
Choose the node that you think will lead to the path with the greatest overall sum. Continue this process until you reach the lower rightmost node.

### Step 4:
When you reach the lower rightmost node, the page will display your win status ("You Win!" or "You Lose").

** ON WIN **
User has the option to increment the level of the game. If the user chooses to go to the next level, the gameboard will reload with (level + 1) rows and (level + 1) columns. The user can continue playing until level 8 is reached, in which case you have reached the greatest level. At this point, the user's level will not increment any further.

** ON LOSS **
User has the option to restart the game at level 1.

Enjoy!