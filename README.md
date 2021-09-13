# Conference Track Manager

A Node.js CLI tool for building, displaying, managing, and saving conference tracks. 🎙

## Features

* Build a multi-day conference schedule by adding talks to any number of tracks
* Display them as tables when finished, with Lunch and Networking Events automatically included
* Or save them to CSV for portability and use in programs like Google Sheets or Microsoft Excel
* Undo/redo mechanic in case you need to go back
* Save and load your progress any time

### Sample input
```
> Writing Fast Tests Against Enterprise Rails 60min
> Overdoing it in Python 45min
> Lua for the Masses 30min
> Ruby Errors from Mismatched Gem Versions 45min
> Common Ruby Errors 45min
> Rails for Python Developers lightning
> Communicating Over Distance 60min
...
```

### Sample output
```
Track 1:
╔════════════╤═════════════════════════════════════════════╤════════════╗
║ START TIME │ TALK NAME                                   │ DURATION   ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 09:00AM    │ Writing Fast Tests Against Enterprise Rails │ 60 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 10:00AM    │ Overdoing it in Python                      │ 45 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 10:45AM    │ Lua for the Masses                          │ 30 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 11:15AM    │ Ruby Errors from Mismatched Gem Versions    │ 45 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 12:00PM    │ Lunch                                       │ 60 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 01:00PM    │ Common Ruby Errors                          │ 45 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 01:45PM    │ Rails for Python Developers                 │ 5 minutes  ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 01:50PM    │ Communicating Over Distance                 │ 60 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 02:50PM    │ Accounting-Driven Development               │ 45 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 03:35PM    │ Woah                                        │ 30 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 04:05PM    │ Sit Down and Write                          │ 30 minutes ║
╟────────────┼─────────────────────────────────────────────┼────────────╢
║ 04:35PM    │ Networking Event                            │ Open-ended ║
╚════════════╧═════════════════════════════════════════════╧════════════╝

Track 2:
...
```


## Getting Started

Since this is a Node.js app, `node` is required to run it. Any relatively recent version should work. I recommend version `12` or higher.

With `node` installed, run `npm i` in the root folder to install the dependencies, then `npm start` or `npm src/app` to start the app.

For convenience and testing purposes, a completed sample conference based on sample inputs can be accessed by selecting `Load from file` in the menu, then `Load a sample conference`.


## Developer Overview

### Specifications

Conference Track Manager was built with an emphasis on convenience and user experience.

Here are the specifications I was given and the assumptions I derived from them while developing the app:

> The conference has multiple tracks each of which has a morning and afternoon session.

I took this to mean that any given conference *can* and probably should have multiple tracks, but must have at least one complete track.

> Each session contains multiple talks.
> Morning sessions begin at 9am and must finish by 12 noon, for lunch.
> Afternoon sessions begin at 1pm and must finish in time f or t he networking event.
> The networking event can start no earlier than 4:00 and no later than 5:00.

These specifications define the basic parameters of the app:
1. 9am to 12pm for the morning leaves three hours to have a variety of talks. From this I determined that each talk should not be longer than one hour.
2. The remaining time minus lunch leaves a maximum of four hours of the rest of the track, since the networking event mustn't start later than 5pm
3. Conversely, the afternoon session must not be shorter than three hours, since networking can't start before 4pm

> No talk title has numbers in it.

I interpreted this to mean that talk titles must not contain number, so the app will throw an error if the user tries to use them in a title.

> All talk lengths are either in minutes (not hours) or lightning (5 minutes).
> Presenters will be very punctual; there needs to be no gap between sessions.

That makes it relatively to determine the logic which slots the talks into either morning or afternoon session, based on available time.
So these are the constants I'm using for the app:

```javascript
// src/constants/parameters.js

const MIN_TRACK_DURATION = 360;
const MAX_TRACK_DURATION = 420;

const MIN_TALK_DURATION = 5;
const MAX_TALK_DURATION = 60;

const BASE_TALK_START_TIME = '09:00AM';
```

A track must be at least 360 minutes long to generate a conference schedule from it. It must be at most 420 minutes long for the networking event to start at 5pm, the latest possible time. The first talk of the morning session starts at 9am, which is the basis from which subsequent start times will be calculated by the app (see `src/utils/parseMins.js` and `src/utils/incrementTime.js`).


### User stories and implementations

Based on the above specifications and my own preference for providing good user experience, I derived the following user stories:


#### Story #1

> "I am interfacing with a friendly CLI that presents me with options for currently available actions to choose from, such as adding a new talk or printing the schedule."

For each possible state of the application, the user should be prompted and able to choose from a list of options, which in the app are connected to specific `actions`, i.e. functions that have concrete effects the user can observe, such as adding a new talk and seeing the metrics change, removing a talk, listing the talks, saving or writing to file:

```bash

? What would you like to do? (Use arrow keys)
> Add a talk
  Undo adding "Hello World 15min"
  ------
  Print completed tracks (2) to screen
  Write conference to CSV file
  List talks added so far
  ------
(Move up and down to reveal more choices)
  ...
```

I used the [inquirer](https://github.com/SBoudrias/Inquirer.js) for that purpose, which itself aims for seemless user experience. It is used by several functions of the app to get user input such as the text input for the talks. The available options, based on the current state of the app, are generated by `src/main/getActionChoice.js` which passes the user choice to `src/main/selectAction.js`. This function is the centerpiece of the application flow:

```javascript
// src/main/selectAction.js

async function selectAction(choice, state, callback) {
  switch (choice) {
    case 'Add':
      await addTalk({ ...state });
      return callback();
    case 'Undo':
      removeLastTalk(state.talks);
      return callback();
    case 'Redo':
      undoRemoveTalk();
      return callback();
    case 'List':
      listTalks(state.talks);
      return callback();
    case 'Print':
      printTrackTables(state.talks, state.completedTrackNum);
      return callback();
    case 'Write':
      writeToCSV(state.talks);
      return callback();
    case 'Save':
      saveToFile();
      return callback();
    case 'Load':
      await loadFromFile();
      return callback();
    case 'Exit':
      return 0;
    default:
      return 1;
  }
}
```

In the app, the function recursively calls `main` (which then re-provisions it with the state), unless the user chooses `Exit`.


#### Story #2

> "Before entering a new talk, I can track information about my progress. I can see how many tracks I have completed, how far I am from completing the current track, and how much time I currently need to fill to complete the track and print the schedule."

Since I require the user to complete at least one full track before the options to generate a schedule become available, I need to provide them with the relevant metrics before each new input. In the app, when starting fresh, it looks like this:

```bash
 Welcome to Conference Track Manager v1.0.0!                                                                                                                            
                                                                                                                                                                         
          Completed tracks: 0 / 1 - fill another 360 minutes to complete current track                                                                                   
                                                                                                                                                                  
  ? What would you like to do? 
  ...
 ```
 
 ```javascript
// src/main/displayTrackStatsMsg.js

function displayTrackStatsMsg(completedTracks, trackDuration, trackNum) {
  const trackIndicatorCol = completedTracks ? green : gray;

  const fillTrackMsg = `fill another ${blue(
    MIN_TRACK_DURATION - trackDuration,
  )} minutes to complete current track`;
  const leftInTrackMsg = `${blue(
    MAX_TRACK_DURATION - trackDuration,
  )} minutes remaining in this track`;

  const message = `\n\tCompleted tracks: ${trackIndicatorCol(
    completedTracks,
  )} / ${bold(trackNum)} - ${
    MIN_TRACK_DURATION - trackDuration > 0 ? fillTrackMsg : leftInTrackMsg
  }\n`;

  console.log(message);
}
```

 The user can see which track they are currently on, whether it is complete, and how much longer to complete it. The user can also view a list of all the talks they added at any time.
 
 
#### Story #3
 
 > "The app respects the order of my inputs, i.e. the app doesn't change the order of talks behind the scenes. However, it tries to fill any avoidable downtime before lunch."
 
I think it is fair to assume that a conference host would not want the app to shuffle the order of talks around in the name of time efficiency. 

In a conference, each talks often provides context for the next, or is part of a specific topic group, so order matters. One very reasonable exception would be to avoid idle time between the last morning talk and lunch, e.g. if the second-to-last morning talk ends at 11:15AM and the last one is 60 minutes long. Then the app would move that talk to the afternoon, but fill those 45 minutes remaining in the morning when possible.

This is the responsible piece of logic in the app:

```javascript
// src/actions/addTalk.js
...
   let session;                                                                                                                                                         
   let fillMorningStartTime;                                                                                                                                            
                                                                                                                                                                         
    // Determine morning/afternoon session based on available time                                                                                                       
    if (state.maxMorningTalkRemaining - talkDuration >= 0) {                                                                                                             
      session = 'morning';                                                                                                                                               
      state.maxMorningTalkRemaining -= talkDuration;                                                                                                                     
                                                                                                                                                                         
      if (state.morningComplete) {                                                                                                                                       
        const [prevMorningTalk] = state.talks                                                                                                                            
          .filter((talk) => talk.session === 'morning')                                                                                                                  
          .slice(-1);                                                                                                                                                    
        fillMorningStartTime = incrementTime(                                                                                                                            
          prevMorningTalk.startTime,                                                                                                                                          
          prevMorningTalk.duration,                                                                                                                                      
        );                                                                                                                                                               
      }                                                                                                                                                                                                                                            
...
```


#### Story #4

> "I can undo one or more inputs if I make a mistake. I'm also able to redo if I change my mind"

Asking potentially dozens of talks by hand is a fairly tedious task for the user. It could be extremely frustrating, then, should they make a spelling mistake, for example, and have to start over. This is why I included a simple undo/redo mechanic in the app, which works by reverting to a previous application state.

As the backbone for that mechanic, and basic state management within the app in general, I wrote this slight extension of `Map`:

```javascript
// src/state/StateMap.js

class StateMap extends Map {
  constructor(state) {
    super();
    this.initState = Object.freeze({ ...state });
    this.set('default', this.initState);
    this.set('current', 'default');
  }

  isState(obj) {
    return (
      Object.keys(obj).length === Object.keys(this.initState).length &&
      Object.keys(this.initState).every((key) => Object.prototype.hasOwnProperty.call(obj, key),
      )
    );
  }

  resolve(key) {
    const result = this.get(key);

    if (this.isState(result)) {
      return result;
    }
    if (this.has(result)) {
      return this.resolve(result);
    }

    return 1;
  }
  
  chain(newState, key = Date.now()) {
    if (!this.isState(newState)) {
      return 1;
    }

    const prevState = this.resolve('current');

    this.set(key, { ...prevState });
    this.set('previous', key);
    this.set('current', { ...newState });

    return newState;
  }
}
```

The idea is to allow the user to walk back and forth in state using this pair of functions:

 ```javascript                                                    
// src/actions/removeLastTalk.js                                                                                                                               
                           
function removeLastTalk(talks) {                                                                                                                                       
   const { rawName: key } = talks[talks.length - 1];                                                                                                                    
                                                                                                                                                                         
   const prevState = stateMap.resolve(key);                                                                                                                             
                                                                                                                                                                         
   stateMap.set('undo', key);                                                                                                                                           
                                                                                                                                                                         
   return stateMap.chain({ ...prevState }, key);                                                                                                                        
  } 
```

```javascript
// src/actions/undoRemoveTalk.js

function undoRemoveTalk() {                                                                                                                                            
  const state = stateMap.resolve('undo');                                                                                                                              
                                                                                                                                                                         
  const key = stateMap.get('undo');                                                                                                                                    
                                                                                                                                                                         
  stateMap.delete('undo');                                                                                                                                             
                                                                                                                                                                         
  return stateMap.chain({ ...state }, key);                                                                                                                            
 } 
```


#### Story #5

> "I can save my progress and load it at a later time to resume my work."

If a user needs to enter a lot of talks, they might not have the time and energy to finish in one session. They should be able to save their progress, so they can close the app and load it up at a later point in time.

For that reason I implemented basic saving/loading capabilities, which work by stringifying the current state and saving it to `.save-state.json` in the folder `.save-states`, or parsing a state object from JSON and loading it into the current state (see `src/actions/saveToFile.js` and `src/actions/loadFromFile.js`.

Incidentially, here is the state object with the initial values. 

```javascript
const initState = Object.freeze({
  completedTrackNum: 0,
  currentTrackComplete: false,
  currentTrackDuration: 0,
  currentTrackNum: 1,
  lunchEaten: false,
  maxAfternoonTalkRemaining: 240,
  maxMorningTalkRemaining: 180,
  morningComplete: false,
  nextTalkStartTime: BASE_TALK_START_TIME,
  talks: [],
});
```

`StateMap` is instantiated with it and `main` passes the current state down the function hierarchy on each run (see `src/main/main.js`).


#### Story #6

> "I'm able to write my conference to a format like .csv, so I can view and edit it in programs like Excel, and share it with others."

Printing the schedules as unicode tables is nice, but it's not portable. As the user, I would like to have something tangible for my efforts, like a spreadsheet file I can share with colleagues, friends, or fellow conference organizers.

JSON works for computers, but it's not optimal for humans. For that reason I added the option and functionality to write the (completed) tracks to CSV (`actions/writeToCSV.js`).


### Conclusion

This concludes the overview over the major functionality of the app in the context of the specs and the user stories I described. 

This has been a fun and interesting project, and there definitely remains room for future improvements and features.

Thank you for reading!
