# Conference Track Manager

A Node.js CLI tool for building, displaying, managing, and saving conference tracks. 🎙

## Features

* Build a multi-day conference schedule by adding talks to any number of tracks
* Display them as tables when finished, with Lunch and Networking Events automatically included
* Or save them to CSV for portability and use in programs like Google Sheets or Microsoft Excel
* Undo/redo mechanic in case you need to go back
* Save and load your progress any time

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

## Development Report

### Reviewing the specifications

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

I interpreted this to mean talk titles must not contain number, so the will throw an error if the user tries to use them in a title

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

A track must be at least 360 minutes long to generate a conference schedule from it. It must be at least 420 minutes long for the networking event to start at 5pm, the latest possible time. The first talk of the morning session starts at 9am, which is the basis from which subsequent start times will be calculated.

### User stories and assumptions

Based on the above specifications and my own preference for providing good user experience, I derived the following user stories:

> "Before entering a new talk, I want to see information about my progress. I want to see how many tracks I have completed, how far I am from completing the current track, and how much time I currently need to fill to complete the track and print the schedule."

Since I require the user to complete at least one full track before a schedule can be generated, I need to provide them with the relevant statistics before each new input. In the app, when starting fresh, it looks like this:

```
 Welcome to Conference Track Manager v1.0.0!                                                                                                                            
                                                                                                                                                                         
          Completed tracks: 0 / 1 - fill another 360 minutes to complete current track                                                                                   
                                                                                                                                                                  
  ? What would you like to do? 
  ...
 ```
 
 The user can see which track they are currently on, whether it is complete, and how much longer to complete it.
 
 > "I want the program to respect the order of my inputs, i.e. the app shouldn't change the order of talks. However, I would like to avoid any downtime before lunch."
 
I think it is fair to assume that a conference host would not want the app to shuffle the order of talks around in the name of time efficiency. 
In a usual conference, each talks often provides context for the next, or is part of a specific topic group, so order matters. One very reasonable exception would be to avoid idle time between the last morning talk and lunch, e.g. if the second-to-last morning talk ends at 11:15AM and the last one is 60 minutes long. Then the app would move that talk to the afternoon, but fill those 45 minutes remaining in the morning when possible.

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
          fillMorningStartTime,                                                                                                                                          
          prevMorningTalk.duration,                                                                                                                                      
        );                                                                                                                                                               
      }                                                                                                                                                                                                                                                 
...
```



