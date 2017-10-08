# The Voice Heard 'Round WRLD

October 2017

### Authors
This is the Calhacks 2017 project created by Justin Wang, Amarinder Chahal, Darren Huang, Matthew Chan. 

### About
Through the use of WRLD, Google Cloud, and an amalgamation of other API's, we designed an interface with the goal of virtualizing travel and exploration in three dimensions.  Through this implementation of WRLD and the various social databases we accessed, we have created a user-friendly interface designed to help people experience, understand, and stay connected in the world at the convenience of the internet.

Some key features we have:

- Recent Twitter activity map
- Route functionality indoors between two room names in the same building
- Route functionality indoors between two room names in different buildings
- Optimized POI routing for user convenience
- Live routing from user's current position to given destination
- Complete Voice control for all of the above features and more

### Inspiration

Google Maps provides a competitively dominating 2-dimensional mapping service, which is extremely convenient for the user in many situations. However, it falls short in it's presence in the real world--it cannot consider the indoors or vertical positioning. This leads to a much larger missed chance at discovering data patterns in companies regarding employee performance, user activity patterns, and population dynamics and regulation, among other things.Additionally, the simple but powerful feature of indoor map routing could easily prove revolutionary in its own right.

We strived to take advantage of these unique features the WRLD API provides. In addition to social media heatmaps and recent user activity, a large goal of our product was taking the target audience of WRLD from mainly companies and designers to the average everyday user. They are empowered by the convenience and ease provided by the 3d rendering of the world, all done through simple, everyday user interactions and dialogue. 

### How It Works

Our project essentially operates in several core parts:

1. (If user uses voice command) Converting speech to text command
2. Analyzing text command or user interaction to appropriate WRLD interaction
3. Processing WRLD interaction and displaying output to user
4. Prepare for the cycle to repeat
    
In part 1, we utilize the Google Cloud Platform API to process speech to text. Implementing this API proved resourceful but tricky. A problem we encountered was the slow response time--simply processing the buffer client side and then attempting to transfer the data across the web yielded poor performance results. We fixed this by mostly utilizing shorter audio clips as opposed to constant voice detection.

In part 2, we analyze the supplied buffer. We parse the text command and test against multiple basic cases. More complicated code ensues in trying to account for "noise"&mdash;errors in the algortihms processing that cannot be controlled by the program (and often not by the user). As a result, near-misses and similar user voice commands preserve intent, minimizing the damage presented by the error.

Part 3 involves calling the appropriate method to convert the text command into a WRLD interaction. This step is simple for most cases, directly calling the appropriate WRLD method. However, several cases are trickier. The most complex is the routing case, in which the program must not only determine the starting and ending destinations, but also whether these destinations lie indoors or outdoors (for a total of 4 different possible cases). This is further complicated by attempts at error-correction: the Hamming distance of these patterns is greatly reduced and more measures must be taken to preserve original intent.

Part 4 is straightforward. We reset necessary variables and objects in the rendered WRLD to prepare for the user's next interaction.

### Uses of the Social Media Extension

The social media extension has two main goals. The first is the visualization of data to help find patterns through big data regarding certain topics. The user searches through various tweets and retweets under a certain hashtag in a certain time-periods. This data is not limited to large analysis for use either; our second goal is to demonstrate its use to everyday users. Users can use it to follow the travels of a friend in a 3-dimensional world, see the divide of opinions over different states under a political hashtag, receive alerts of nearby activity (or potential protests, local distasters, etc.), and much, much more.

Though related, the Cisco Spark Implemenation has a different intention, more directed towards businesses. Companies can view the location data and timestamps of employees automatically to determine peak efficiency hour, or when employees have been less honest with their bosses about meeting attendance. This helps strengthen the bond between manager and employee, keeping both connected and raising overall efficiency. Note that this is a work in progress.

### Built With:

- WRLD.js API
- Google Cloud Platform API
- Twitter API
- Leaflet.js API
- Cisco Spark API
- Javascript
- Node.js
- jQeury
- Underscore
- Jade
- CSS
- 36 hours of blood, sweat and tears




