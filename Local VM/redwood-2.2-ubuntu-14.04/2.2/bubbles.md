# Hotelling Markups Experiment Design

## UI

### Bubbles user interface

Read over this discussion of bubbles: https://leeps.ucsc.edu/cong/wiki/Bubbles

And here is code to help get started. https://github.com/Leeps-Lab/bubbles 
The payoff function we use is quite different from this “BJ Pricing” payoff function. 
If our config file instructions diverge from these, for example a different name for the same thing, stick with these settings.


----------------------------------------------------------------------------------------------------------
## Payoff function

I feel this is a nice intro to the model: http://www.eco.uc3m.es/~mmachado/Teaching/OI-I-MEI/slides/4.2.Hotelling%20Model.pdf


### Linear Transport costs: 

Here’s an easier to read discussion of our payoff function https://docs.google.com/document/d/1h341WbjaRJTPh4ISUqHXP4N0h8vVDSW-Z8uPGk11AYg/edit#heading=h.5cahesdbu7ym

Here’s code that **should** be working, https://github.com/Leeps-Lab/Hotelling/blob/master/Hotelling%20R2/normal/main.js. 
Note the linear transport costs section (ctrl-f “linear” for all the sections). It does this pretty well. 


Coding: here’s a detailed description of coding linear transport costs: https://docs.google.com/document/d/1W4f3XuDaniG9aSsAEEQfIzFn3eDfySxFgLMlAoxdhI4/edit?usp=sharing

### Quadratic transport costs: 

See https://github.com/Leeps-Lab/Hotelling/blob/master/Hotelling%20R2/normal/main.js. 

But there may be issues with this quadratic code that we need to debug. 




-----------------------------------------------------------------------------------------------------------
## Config file

Default values. When noted, please have config value with a default. Meaning that if we removed them from the config file, the experiment would automatically default to the noted value. 

### Time settings
* `num_periods`
* `group_size`
* `period_length`
* `subperiods` 
* `percentChngPerSec`


### UI Bubbles options: 
* `other_players` = boolean. 
* Default to TRUE. 
* If true, in the bubble display you can see other players locations “bubbles” in the bubbles ui. If false, you can’t, other players dots are all hidden. 
* `other_profits` = boolean. 
* If true, player can see other players profits. They’s see that in the form of the vertical height of other players’ in the bubble UI. 
* If false, then other players have their x-axis location indicated by a market along the a-axis, but their vertical height is always the lowest possible. The player can’t see other’s current flow profit, only their own. 
* Default to TRUE. 
* `potential` = boolean
* Default to FALSE
* if set to TRUE, you can see the “Potential Curve” or “potential payoff landscape”. See https://leeps.ucsc.edu/cong/wiki/Bubbles for discussion. 
* if FALSE, players can’t see the potential curve.  

### Payoff function options
* `payoff_func` = char string 
	* only two options now, “linear” and “quadratic”
	* default to “linear”
	* linear means use the linear transport costs payoff function
	* quadratic means use the quadratic transport costs payoff function. 
* `loc` = array. E.g. [0.25,0.75]
* `r`. Reservation price
* `t`. Transport cost. 

### Other
* `turn` = boolean. 
* Default to FALSE. 
* Only applies to discrete time games, not continuous time.  
* If turn == TRUE, in discrete time subperiods the game is “turn based”. With N players in group, in one subperiod only one player is able to make a move, the other players are all fixed at their old selection.  This turn rotates around the possible number of players in the group (imagine your playing a board game)
* If turn == FALSE, the discrete time subperiod is a “simultaneous” move game. In each subperiod, each player is able to select a new position. 


----------------------------------------------------------------------------------------------------------
## Data to save

Log config file settings into saved data. 
Log player actions selections several times a second, with timestamp. 



