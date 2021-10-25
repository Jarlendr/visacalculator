# Visa Calculator
This website is designed to make it easier for the frequent traveler to plan stays in the 
EU/Schengen area (or other zones and countries with similar visa-free rules). 

## How to use
By simply inputting the start and end dates for your planned stay, as well as any recent stays, 
the calculator will check if you exceed the 90/180-day rule at any point during your planned stay.
The calculated number of days will be displayed in the top section of this website. 
If you spend 90% or more of the total available days, the website will turn orange/yellow and issue a warning. 
If you spend the full 90 days or more, the website will turn red and show the date that you overstay. Additionally, a circle path
will help you understand how big a percentage of the 90 days that you have used.

## Motivation
Being in a long distance relationship with someone from across the Schengen borders, international travel for me and
my partner is frequent, and can make it complicated to manually calculate whether or not we overstay in the Schengen area.
Some Schengen visa calculators already exists (even an official one), but I found their design to be rather archaic and not
fully functional on a smartphone.
I therefore wanted to make a calculator that functions well on both mobile and desktop, with a colourful, playful and simple design.

## Technologies used
The website uses HTML and CSS for the visual design, and vanilla javascript for fetching inputs, calculating and making the website more dynamic.
Functional programming principles are used, as well as some ES6 features. 

## Challenges and ideas for the future
As this is my first full webpage, one of the biggest challenges was the visual design of the website. Before starting
the project, I had a clear idea of how the website would function, though I had created no user stories, design diagrams or other such helpful tools.
Getting the calculator to function was not so difficult, but structuring the code took more time and effort. I wanted to avoid spaghetti code as much
as possible. Thankfully, the scope of the project is limited, and this helped tremendously in structuring the code and the project itself.

The design of the website was certainly difficult, and I attempted many different designs before I found one that I was somewhat happy with. The
biggest concern is generally how to make it look professional, while still simple, playful and functional. I am content with the design as it is, but have
some thoughts to try to improve upon it. For example:

- Try to combine the 'planned stay' and 'previous stays'.
- Being able to remove a specific stay, instead of just the last one on the list.
- Being able to add a stay at the top, pushing the other stays back (the first will always be the planned stay).
- Showing how many days you have left for staying.

