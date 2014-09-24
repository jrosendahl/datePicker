datePicker
==========

There are lots of date picker controls out there.  This one is mine.  You can use it as well.

##Highlights
* Can output date to multiple dom elements
* Tries really hard to use the value of the input it is attached to
* Has some localization and formating support
* Need to use an event shim/polyfill for IE8 support (https://github.com/WebReflection/ie8)
* Vanilla JavaScript no external dependencies for modern browsers

##Syntax:
```
new datePicker(inputElement, otherTargets, config);
```
 
#####inputElement (required)
The id of the element the date control is bound to.  Must be an Input

#####otherTargets (optional)
An array of additional output target elements.  Each array element is an object containing {id: elementID, format:formatValue} 

#####config (optional)
{inputFormat: formatValue,
 weekdays: [array of weekday names],
 mondayIndex:1, months: [array of month Names]}

The mondayIndex is the day of week position of Monday.  To start the calendar week on Monday you would use an Monday Index of 0 instead of 1.

#####formatValue: 
The following characters have value for date formating
> d – prints the day of month
D – Prints the first three letters of the day of week (i.e. Mon)
m – Prints the month number (i.e. 1)
M – Prints the name of the month (i.e. January)
y – Prints the 2 digit year
Y – Prints the 4 digit year <

All other characters pass through.

###Formatting: 
The included CSS file provides basic formatting of the calendar.

###Credits:
I used https://code.google.com/p/datepickr/ as a reference, however there is no code shared between the  two different implementations
