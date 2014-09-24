var datePicker = (function() {
	'use strict';
	var datepickers = [];
	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var monthValues = ['01', '02', '03', '04','05','06','07','08','09','10','11','12'];

	function buildDate(year, month, day) {
		var dayString = (parseInt(day,10) < 10) ? ('0' + parseInt(day,10)) : day;
		return  new Date(year + '-' + monthValues[month] + '-'+ dayString);
	}

	function OutputDate() {
		var self = this;
		var date = buildDate(this.current.year, this.current.month, this.current.day);
		function formatPart(part){
			switch(part) {
				case 'd': 
					return ((date.getUTCDate() < 10) ? '0' + date.getUTCDate() : date.getUTCDate());
				case 'D':
					var dow = date.getUTCDay();
					return self.config.weekdays[dow].substring(0,3);
				case 'm':
					return ((date.getUTCMonth() < 9) ? '0' + (date.getUTCMonth() + 1): date.getUTCMonth() + 1);
				case 'M':
					return self.config.months[date.getUTCMonth()];
				case 'y':
					return date.getUTCFullYear().toString().substring(2, 4);
				case 'Y':
					return date.getUTCFullYear();
				default:
					return part;
			}
		}
		
		function buildString(format) {
			var parts = format.split('');
			var string = '';
			for(var i =0; i < parts.length; i++) {
				string += formatPart(parts[i]);
			}
			return string;
		}

		this.element.value = buildString(this.config.inputFormat);
		if(this.outputs instanceof Array) {
			for(var i =0; i< this.outputs.length; i++) {
				var element = document.getElementById(this.outputs[i].id);
				if(element.nodeName == 'INPUT') {
					element.value = buildString(this.outputs[i].format);
				}
				else {
					element.innerHTML = buildString(this.outputs[i].format);
				}
			}
		}
		self.element.blur();	
	}

	function BuildCalendar() {
		var self = this;
		function clickOnDay(e) {

			self.element.removeEventListener('input', self.inputChange);
			switch(e.target.className) {
				case 'datePickerElement-dayOfMonth datePickerElement-dayOfMonth-previousMonth': 
					if(self.current.month > 0) {
						self.current.month--;
					}
					else {
						self.current.month = 11;
						self.current.year--;
					}
					self.current.day = e.target.firstChild.nodeValue;
					break;
				case 'datePickerElement-dayOfMonth datePickerElement-dayOfMonth-currentMonth':
				case 'datePickerElement-dayOfMonth datePickerElement-dayOfMonth-today':
					self.current.day = e.target.firstChild.nodeValue;
					break;
				case 'datePickerElement-dayOfMonth datePickerElement-dayOfMonth-nextMonth':
					if(self.current.month < 11) {
						self.current.month++;
					}
					else {
						self.current.month = 0;
						self.current.year++;
					}
					self.current.day = e.target.firstChild.nodeValue;
					break; 
			}
			OutputDate.call(self);
			self.close();
		}
		function resumeBlur() {
			self.element.addEventListener('blur', self.inputBlur);
			self.element.focus();
		}
		function stopBlur() {
			self.element.removeEventListener('blur', self.inputBlur);
			self.calendar.addEventListener('mouseup', resumeBlur);
		}


		this.calendar = document.createElement('div');
		this.calendar.className = 'datePickerElement-calendarContainer';
		this.calendar.addEventListener('mousedown', stopBlur);

		var div_calendarHeader = document.createElement('div');
		div_calendarHeader.appendChild(document.createTextNode(''));
		div_calendarHeader.className = 'datePickerElement-calendarHeader';
		this.calendar.appendChild(div_calendarHeader);
		
		var div_calendarNavigation = document.createElement('div');
		div_calendarNavigation.className = 'datePickerElement-calendarNavigationContainer';
		var div_nextMonth = document.createElement('div');
		var div_previousMonth = document.createElement('div');
		this.calendar.appendChild(div_calendarNavigation);

		div_nextMonth.className = 'button datePickerElement-calendar-nextMonth smallButton';
		div_previousMonth.className = 'button datePickerElement-calendar-previousMonth smallButton';
		div_calendarNavigation.appendChild(div_previousMonth);
		div_calendarNavigation.appendChild(div_nextMonth);
		

		div_nextMonth.appendChild(document.createTextNode('next ->'));
		div_nextMonth.addEventListener('click', function() {
			if(self.current.month < 11) {
				self.current.month++;
			}
			else {
				self.current.month = 0;
				self.current.year++;
			}
			PopulateCalendar.call(self);
		});

		div_previousMonth.appendChild(document.createTextNode('<- prev.'));
		div_previousMonth.addEventListener('click', function() {
			if(self.current.month > 0) {
				self.current.month--;
			}
			else {
				self.current.month = 11;
				self.current.year--;
			}
			PopulateCalendar.call(self);
		});

		var table_calendar = document.createElement('table');
		this.calendar.appendChild(table_calendar);

		var thead_calendar = table_calendar.createTHead();
		var thr_calendar = thead_calendar.insertRow(0);
		var tbody_calendar = table_calendar.createTBody();
		var tr_calendar = tbody_calendar.insertRow(0);

		for(var i =0; i < this.config.weekdays.length; i++) {
			var td_head = thr_calendar.insertCell();
			td_head.className = 'datePickerElement-dayOfWeekLabel';
			td_head.appendChild(document.createTextNode(this.config.weekdays[i].substr(0,2)));
			var tr_cell = tr_calendar.insertCell();	
			tr_cell.appendChild(document.createTextNode(''));
			tr_cell.addEventListener('click', clickOnDay);
		}
		for(var i = 0; i < 5; i++) {
			var row = tr_calendar.cloneNode(true);
			for(var j = 0; j < row.cells.length; j++) {
				row.cells[j].addEventListener('click', clickOnDay);
			}
			tbody_calendar.appendChild(row);

		}	

		this.calendar.style.display = 'none';
		this.element.parentNode.appendChild(this.calendar);

	}

	function PopulateCalendar() {
		this.calendar.childNodes[0].replaceChild(document.createTextNode(this.config.months[this.current.month] + ' ' + this.current.year), this.calendar.childNodes[0].childNodes[0]);	
		var calendarDates = this.calendar.childNodes[2].tBodies[0];
		var firstDayOfMonth = buildDate(this.current.year, this.current.month, 1);
		var firstDayOfWeek = firstDayOfMonth.getDay();
		var currentLastDayOfMonth = (this.current.month == 1 && !(this.current.year & 3) && (this.current.year % 1e2 || !(this.current.year % 4e2))) ? 29 : daysInMonth[this.current.month];
		var previousMonth = ((this.current.month === 0) ? 11 : this.current.month - 1);
		var previousLastDayOfMonth = (previousMonth == 1 && !(this.current.year & 3) && (this.current.year % 1e2 || !(this.current.year % 4e2))) ? 29 : daysInMonth[previousMonth];
		
		var previousMonthCounter = firstDayOfWeek + this.config.mondayIndex -1;
		var currentMonthDay = 1;
		var endCounter = 1;
		var currentDay, cellClass;

		for(var row = 0; row < calendarDates.rows.length; row++){
			var curentRow = calendarDates.rows[row];
			for(var i = 0; i < curentRow.cells.length; i++) {
				if(previousMonthCounter >= 0) {
					currentDay = previousLastDayOfMonth - previousMonthCounter;
					cellClass = 'datePickerElement-dayOfMonth-previousMonth';
					previousMonthCounter--;
				}
				else {
					if(currentMonthDay <= currentLastDayOfMonth) {
						currentDay = currentMonthDay;
						cellClass = ((this.today.getUTCDate() == currentDay && this.today.getUTCMonth() == this.current.month && this.today.getUTCFullYear() == this.current.year) ?'datePickerElement-dayOfMonth-today':'datePickerElement-dayOfMonth-currentMonth');
						currentMonthDay++;
					}
					else {
						currentDay = endCounter;
						cellClass = 'datePickerElement-dayOfMonth-nextMonth';
						endCounter++;
					}
				}
				curentRow.cells[i].replaceChild(document.createTextNode(currentDay), curentRow.cells[i].childNodes[0]);
				curentRow.cells[i].className = 'datePickerElement-dayOfMonth ' + cellClass;
			}
		}

	}


	return function(input, outputs, userConfig) {
		var self = this;
		var dateCache = new Date(Date.now());
		
		this.outputs = outputs;

		this.current = {
			year: dateCache.getFullYear(),
			month:dateCache.getMonth(),
			day:dateCache.getDate()
		};
		//this stupid line keeps us in ISO date.
		dateCache = buildDate(this.current.year, this.current.month, this.current.day);

		this.config = {
			inputFormat: 'm/d/Y',
			weekdays: ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			mondayIndex:1,
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		};

		if(userConfig) {
			for(var key in userConfig) {
				if(this.config.hasOwnProperty(key)) {
					this.config[key] = userConfig[key];
				}
			}
		}

		this.config.dateParts = this.config.inputFormat.match(/[mdyY]/g);
		this.element = document.getElementById(input);
		
		function getDateValue() {
			function parseDate(date) {
				var parts = date.match(/[\d]+/g);
				for(var i = 0; i < self.config.dateParts.length; i++) {
					switch(self.config.dateParts[i]) {
					case 'd':
						self.current.day = parts[i]|| self.current.day;
						break;
					case 'm':
						self.current.month = (parts[i] ? parts[i] -1  : self.current.month);
						break;
					case 'y':
					case 'Y':
						if(parts[i] && parts[i].length === 4) {
							self.current.year = parts[i];
						}
						else {
							if(parts[i] && parts[i].length === 2) {
								self.current.year = '20' + parts[i];
							}
						}
						break;
					}
				}
				if(self.current.year.length == 2) {
					self.current.year = '20' + self.current.year;
				}
			}
			if(self.element.value) {
				parseDate(self.element.value);
				var date = buildDate(self.current.year, self.current.month, self.current.day);
				if(date != 'Invalid Date') {
					return date;
				}
			}
			self.current = {
				year: dateCache.getUTCFullYear(),
				month:dateCache.getUTCMonth(),
				day:dateCache.getUTCDate()
			};
			return dateCache;
		}

		this.eventOnElement = function(e) {
			var clickedEle= e.target;
			while(clickedEle != null) {
				if(clickedEle === self.element || clickedEle === self.calendar) {
					return true;
				}
				clickedEle = clickedEle.parentNode;
			}
			return false;
		};

		function documentClick(e) {
			if(!self.eventOnElement(e)) {self.close();}
		}

		this.inputChange = function() {
			self.today = self.value;
			PopulateCalendar.call(self);
		};

		this.inputBlur = function() {
			self.today = self.value;
			OutputDate.call(self);
			self.close();
		};

		Object.defineProperty(this, 'value', {get:getDateValue});
		
		this.close = function() {
			document.removeEventListener('click', documentClick);
			self.element.removeEventListener('input', self.inputChange);
			self.element.removeEventListener('blur', self.inputBlur);
			self.calendar.style.display = 'none';
			self.element.addEventListener('focus', self.open);
		};

		this.open = function() {
			self.element.removeEventListener('focus', self.open);
			self.today = self.value;
			PopulateCalendar.call(self);
			for(var i = 0; i < datepickers.length; i++) {
				if(datepickers[i] != self) {
					datepickers[i].close();
				}
			}
			document.addEventListener('click', documentClick);
			self.element.addEventListener('input', self.inputChange);
			self.element.addEventListener('blur', self.inputBlur);
			self.calendar.style.display = 'block';
		};

		BuildCalendar.call(self);
		datepickers.push(this);
		this.element.addEventListener('focus', this.open);
	};

})();
