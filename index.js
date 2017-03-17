/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______    ______    ______   __  __    __    ______
 /\  == \  /\  __ \  /\__  _\ /\ \/ /   /\ \  /\__  _\
 \ \  __<  \ \ \/\ \ \/_/\ \/ \ \  _"-. \ \ \ \/_/\ \/
 \ \_____\ \ \_____\   \ \_\  \ \_\ \_\ \ \_\   \ \_\
 \/_____/  \/_____/    \/_/   \/_/\/_/  \/_/    \/_/


 This is a sample Slack Button application that provides a custom
 Slash command.

 This bot demonstrates many of the core features of Botkit:

 * Authenticate users with Slack using OAuth
 * Receive messages using the slash_command event
 * Reply to Slash command both publicly and privately

 # RUN THE BOT:

 Create a Slack app. Make sure to configure at least one Slash command!

 -> https://api.slack.com/applications/new

 Run your bot from the command line:

 clientId=<my client id> clientSecret=<my client secret> PORT=3000 node bot.js

 Note: you can test your oauth authentication locally, but to use Slash commands
 in Slack, the app must be hosted at a publicly reachable IP or host.

 # EXTEND THE BOT:

 Botkit is has many features for building cool and useful bots!

 Read all about it here:

 -> http://howdy.ai/botkit

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

// EDIT ME!
controller.on('slash_command', function (slashCommand, message) {

    switch (message.command) {
        case "/foodme": //handle the `/foodme` slash command. We might have others assigned to this app too!

            // Let's make sure the token matches. No imposters allowed!
            if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            if (message.text === "") {
              // Master list of foodmoji
              foodmoji = [":coffee:",":tea:",":sake:",":baby_bottle:", \
                ":beer:",":beers:",":cocktail:",":tropical_drink:", \
                ":wine_glass:",":fork_and_knife:",":pizza:",":hamburger:", \
                ":fries:",":poultry_leg:",":meat_on_bone:",":spaghetti:", \
                ":curry:",":fried_shrimp:",":bento:",":sushi:",":fish_cake:", \
                ":rice_ball:",":rice_cracker:",":rice:",":ramen:",":stew:", \
                ":oden:",":dango:",":egg:",":bread:",":doughnut:",":custard:", \
                ":icecream:",":ice_cream:",":shaved_ice:",":birthday:", \
                ":cake:",":cookie:",":chocolate_bar:",":candy:",":lollipop:", \
                ":honey_pot:",":apple:",":green_apple:",":tangerine:", \
                ":lemon:",":cherries:",":grapes:",":watermelon:", \
                ":strawberry:",":peach:",":melon:",":banana:",":pear:", \
                ":pineapple:",":sweet_potato:",":eggplant:",":tomato:", \
                ":corn:"];
              // TODO Get three random foods

            }

            // /foodme help displays this message
            if (message.text === "help") {
              slashCommand.replyPrivate(message, "Foodme is a Slack command" +
                " that helps you find something to eat. Just type `/foodme`" +
                " to start.")
            }

            break;
        default:
            slashCommand.replyPublic(message, "I'm sorry " + message.user +
                ", I'm afraid I can't do that. :robot_face:");

    }

})
;
