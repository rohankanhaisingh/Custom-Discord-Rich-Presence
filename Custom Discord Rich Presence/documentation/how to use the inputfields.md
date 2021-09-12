# Documentation of all inputfields.

```ts
InputField: TextInputField = any;
```

- - - 

## Details

The details input field requires a ``string``, representing the description about what you are doing in 
you 'game' you are playing.

#### Example:

![Details Input Field](https://cdn.discordapp.com/attachments/857190128405184512/886542126345764895/unknown.png)

Will return:

![Details Return](https://cdn.discordapp.com/attachments/857190128405184512/886542527421898762/unknown.png)

- - -

## State
The state input field requires a ``string``, representing the state of the 'game' you are playing.

#### Example:

![State](https://cdn.discordapp.com/attachments/857190128405184512/886542859631755284/unknown.png)

Will return: 

![Details Return](https://cdn.discordapp.com/attachments/857190128405184512/886542527421898762/unknown.png)

## Large-image key
The large-image key requires a ``string``, representing an large image named to that key on your status. 
Copy any image-key from the Discord Developers Portal, and enter it in this input field.

Leave it empty to not show the large image.

Read the documentation about how to import images to your Discord Application [here](https://github.com/babahgee/Custom-Discord-Rich-Presence/blob/master/Custom%20Discord%20Rich%20Presence/documentation/how%20to%20create%20an%20application.md).

#### Example:

![Beans](https://cdn.discordapp.com/attachments/857190128405184512/886544083961651210/unknown.png)

Will return:

![bruh](https://cdn.discordapp.com/attachments/857190128405184512/886544310990954526/unknown.png)

- - -

## Small-image key
The small-image key requires a ``string``, representing an small image named to that key on your status. 
Copy any image-key from the Discord Developers Portal, and enter it in this input field.

Leave it empty to not show the small image.

Read the documentation about how to import images to your Discord Application [here](https://github.com/babahgee/Custom-Discord-Rich-Presence/blob/master/Custom%20Discord%20Rich%20Presence/documentation/how%20to%20create%20an%20application.md).

#### Example:

![Beans](https://cdn.discordapp.com/attachments/857190128405184512/886544083961651210/unknown.png)

Will return (that small image you see bottom right):

![bruh](https://cdn.discordapp.com/attachments/857190128405184512/886544310990954526/unknown.png)

- - -

## Large-image text
The large-image text requires a ``string``, showing text when you hover over your ``large-image key`` image on your status.

Leave it empty to not show any text when hovering.

#### Example:

![Ayo the pizza here](https://cdn.discordapp.com/attachments/857190128405184512/886545493449146388/unknown.png)

Will return:

![Dogsauce](https://cdn.discordapp.com/attachments/857190128405184512/886545709975879690/unknown.png)

- - -

## Small-image text
The small-image text requires a ``string``, showing text when you hover over your ``small-image key`` image on your status.

Leave it empty to not show any text when hovering.

#### Example:

![Ayo the pizza here](https://cdn.discordapp.com/attachments/857190128405184512/886546707918241874/unknown.png)

Will return:

![Dogsauce](https://cdn.discordapp.com/attachments/857190128405184512/886546627739926558/unknown.png)

- - -

## Start timestamp
The start timestamp requires a ``number``, representing the time when you started playing the game. When focusing on the input field, a date-selector will appear. 
Click on the date-selector to set a specific date and time. Pressing ``Enter`` will set the timestamp in the inputfield.

#### Programmatic interface.
```ts
StartTimeStamp: DateFormat = new Date(Format).GetTime();
```

#### Example

![Sauce](https://cdn.discordapp.com/attachments/857190128405184512/886547959574069348/unknown.png)

Will return:

![Return](https://cdn.discordapp.com/attachments/857190128405184512/886548112926183444/unknown.png)

_Sorry, its dutch but it works the same way_

- - -

## End timestamp
The end timestamp requires a ``number``, representing the time when you game should end. When focusing on the input field, a date-selector will appear. 
Click on the date-selector to set a specific date and time. Pressing ``Enter`` will set the timestamp in the inputfield.

**Note: the value of this input field has to be larger (later) than the start-timestamp inputfield**

#### Programmatic interface.
```ts
EndTimeStamp: DateFormat = new Date(Format).GetTime();
```

#### Example

![Sauce](https://cdn.discordapp.com/attachments/857190128405184512/886548407332798504/unknown.png)

Will return:

![Return](https://cdn.discordapp.com/attachments/857190128405184512/886548382842249216/unknown.png)

_Sorry, its dutch but it works the same way_