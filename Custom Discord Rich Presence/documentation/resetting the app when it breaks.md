# Resetting the application when it *breaks*.

- - -

You know, sometimes any existing application just breaks out of nowhere. So can it be with this application.
That is why I made this documentation so you know what to do when something *breaks*.

- - - 

## Logout using the logout button.

When you are logged in and you see the page where you can setup your own presence status, you will
see your Discord username on your top right. Its a button, press that button and you will see a dropdown menu.

![dropdown](https://cdn.discordapp.com/attachments/857190128405184512/886549898697248789/unknown.png)

Click on 'logout' and it should reset the application it's data and reload. From there, you have to login
again with your Discord Application client ID.

**The 'reload' button will restart the application, but I am not sure if it will fix your problem lol**

- - -

## Clearing the application it's data manually.

Sometimes... it's just better to clear the app it's data manually. I will explain that here.

First on your keyboard, press ``Windows + R``, an input field should appear. Enter ``%appdata%`` and press enter.
You should see a folder with other folders (lmao) that other apps are using and storing data. Find for the folder called 
``custom-discord-rpc``, and remove that entire folder.

![folder name](https://cdn.discordapp.com/attachments/857190128405184512/886551601211392000/unknown.png).

When you start the app again, it should reset and you should be good to go.

- - -

## Killing it from taskmanager.

Opening two instances of the application will seriously break it. It's kinda funny to see but eh yeah it can be annoying for you.
To stop this happning, you can kill it from task manager.

Open taskmanager and find for the apps called 'Custom Discord RPC', kill them and restart the app. To make sure everything should work, I'd recommend you to follow the 
previous method to clear the app it's data.

![man eating burger](https://cdn.discordapp.com/attachments/883971111753244682/886552758881239040/844223659417665546.gif)

- - - 

## Reinstalling the app.
Reinstalling the application is the last method I'd recommend. 

Go to the folder where the application is located and remove all the items. Make sure you deleted it from
your trashbin as well and that you remove the application it's data.

Once you have done that, download the latest release from my Github [repository](https://github.com/babahgee/Custom-Discord-Rich-Presence/releases) and try again.

![shitpost](https://cdn.discordapp.com/attachments/883971111753244682/886356498794565632/DDLVID.COM-1430315798502023170.mp4)

- - -
## Calling out for help.

If it is still broken, just send me a message on Discord ``B?B?? G??#1234`` and I will help you out.