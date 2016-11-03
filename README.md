on virtual machine, inital login credentials (id/pw) is `vagrant`/`vagrant`
ssh vagrant@192.168.33.10

```sh
GET http://192.168.33.10/static/admin/css/base.css                     
GET http://192.168.33.10/static/admin/css/forms.css                    (index):6
GET http://192.168.33.10/static/admin/ace/ace_editor.css               (index):15
GET http://192.168.33.10/static/admin/js/admin/RelatedObjectLookups.js (index):17
GET http://192.168.33.10/static/admin/js/core.js                       (index):16
GET http://192.168.33.10/static/admin/js/jquery.min.js                 (index):18
GET http://192.168.33.10/static/admin/js/jquery.init.js                (index):19
GET http://192.168.33.10/static/admin/js/actions.min.js                (index):20
GET http://192.168.33.10/static/admin/ace/ace_editor.js                (index):22
GET http://192.168.33.10/static/admin/ace/ace.js                       (index):21
GET http://192.168.33.10/static/admin/ace/mode-html.js                 (index):23
GET http://192.168.33.10/static/admin/ace/mode-css.js                  (index):24
GET http://192.168.33.10/static/admin/ace/mode-javascript.js           (index):25
GET http://192.168.33.10/static/admin/js/jquery.cookie.js              (index):29
GET http://192.168.33.10/static/admin/js/inlines.min.js                (index):26
GET http://192.168.33.10/static/admin/js/shortcut.js                   (index):30
GET http://192.168.33.10/static/admin/img/icon_addlink.gif 404 (Not Found) (index):240
```

---

##Sept 27, 2016
An experiment consists of a CSV and a JSON.
The CSV stores variables that differs for every session.
If you run into a "Could not connect to router" it could be because you haven't started the redwood-router.
Start it by `sudo start redwood-router` or disable the firewall (maybe of the local machine or the server).	

---

##Oct 27, 2016
###Problems in Continuous Instant (CI) Treatment

#####Functional errors
1. some individuals does not get fade in modal. keeps going. 
	- could be because browser does not run other tabs at the same time? 
	- Could be because Period length was less than 5? 
	- When this happens, the onComplete() function inside the clock is not called. How can I make it tick? What is the problem?
	- could it be because of JS's asynchronous nature?
	- comparing the logs of the subject that did and the subject that didn't, the faulty subject ticks once more at the beginning.
	- also counts down by 2 instead of 1????? This phenomenon starts sometimes at the beginning and sometimes in the middle.
	- some subjects advance, witho
	- when a subject "sends", does the partner in the group also recv the msg? or only for some?
1. Silo does not work. or rather, randomization after each period does not work.
	- There is no code that randomizes subjects according to the Silos
1. Score seems to be dependent on the speed. This should not be so, because a page refresh will try to recover previous plot points at a faster speed, leading to less score for the subject.
1. download data does not work. (It does work. What.)
1. Flow-payoff plot update is one click off for subject-self. (Subject needs to click again to see the effect of the previous click). check out plotting function. 
	- can be solved with predictable user behaviour (double clicks instead of single clicks)

#####Non-critical Bugs
1. dummy periods (periods that never existed - subjects earn 0 earnings/points - but show up in addition to the original 4 periods.)
1. After refresh, there exists a seemingly underflow error in "Current score" especially for the group that "finished the period"
1. relating to the endless period, reset button fails to work in some unknown conditions (for certain, it was not working at a moment when the period was supposed to end). UPDATE: seems that if there are subjects that finished, reset does not work.


#####UI/UX - noncritical problems
1. Flow-payoff plot is squeezed, not pushed. Ideally, older points should be erased.

###Solved problems
1. in `rs.next_period = function(delay_secs) {}` and `rs.on("_next_period", function() {})`, Programmer confused `_enable_messaging` function with `_messaging_enabled` boolean 
1. After period ends, the fade-in modal appears, but never goes into the next period. solved by calling next_period() function
1. Period never ends. tick() was only called once, because duration was not set according to the config file. This was because send(__config__) calls are asynchronous. Clock was never started with the proper duration. Thus I manually set the configuration right before initializing the clock and it works.
1. variable r was not defined. I assumed it was meant to be used as RedwoodCore. I placed "RedwoodCore" and r in the controller definition and it works. For .set_points, it was in RedwoodSubject, so I replaced it with rs.
1. Width of progress bar became too big (maximum 250%). Solved by changing 250 to 100. (in tick() function)
1. After refresh, subject can still manipulate the plot; current score continues to be accumulated if so. Solved by solving the problem of neverending period
1. the value of __next_period__ induced msg is null?? - kinda solved, the value of the message is still null, however, we do not need the value of the message (which simply states the current period)
	
	```
	(angular-1.2.16.js:9778) 
	TypeError: Cannot read property 'current_period' of null
    at Array.<anonymous> (1:1479)
    at rs._handle_msg (redwoodSubject.js:49)
    at Array.<anonymous> (redwoodCore.js:244)
    at Object.rw.__broadcast__ (redwoodCore.js:321)
    at Object.rw.__handle_msg__ (redwoodCore.js:400)
    at redwoodCore.js:140
    at Scope.$eval (angular-1.2.16.js:12412)
    at Scope.$apply (angular-1.2.16.js:12510)
    at bound WrappedWebSocket.rw.__ws__.onmessage (redwoodCore.js:107)
    ```