openerp.bista_islamic_calendar = function (instance) {
    var _t = instance.web._t,
        _lt = instance.web._lt;
    var QWeb = instance.web.qweb;
    var lang = '';
    var res_obj = new instance.web.Model("res.users");
    instance.web.DateTimeWidget.include({
    	start: function() {
	        var self = this;
	        this.$input = this.$el.find('input.oe_datepicker_master');
	        this.$input_picker = this.$el.find('input.oe_datepicker_container');

	        $.datepicker.setDefaults({
	            clearText: _t('Clear'),
	            clearStatus: _t('Erase the current date'),
	            closeText: _t('Done'),
	            closeStatus: _t('Close without change'),
	            prevText: _t('<Prev'),
	            prevStatus: _t('Show the previous month'),
	            nextText: _t('Next>'),
	            nextStatus: _t('Show the next month'),
	            currentText: _t('Today'),
	            currentStatus: _t('Show the current month'),
	            monthNames: Date.CultureInfo.monthNames,
	            monthNamesShort: Date.CultureInfo.abbreviatedMonthNames,
	            monthStatus: _t('Show a different month'),
	            yearStatus: _t('Show a different year'),
	            weekHeader: _t('Wk'),
	            weekStatus: _t('Week of the year'),
	            dayNames: Date.CultureInfo.dayNames,
	            dayNamesShort: Date.CultureInfo.abbreviatedDayNames,
	            dayNamesMin: Date.CultureInfo.shortestDayNames,
	            dayStatus: _t('Set DD as first week day'),
	            dateStatus: _t('Select D, M d'),
	            firstDay: Date.CultureInfo.firstDayOfWeek,
	            initStatus: _t('Select a date'),
	            isRTL: false
	        });
	        $.timepicker.setDefaults({
	            timeOnlyTitle: _t('Choose Time'),
	            timeText: _t('Time'),
	            hourText: _t('Hour'),
	            minuteText: _t('Minute'),
	            secondText: _t('Second'),
	            currentText: _t('Now'),
	            closeText: _t('Done')
	        });

	        this.picker({
	            onClose: this.on_picker_close,
	            onSelect: this.on_picker_select,
	            changeMonth: true,
	            changeYear: true,
	            showWeek: true,
	            showButtonPanel: true,
	            firstDay: Date.CultureInfo.firstDayOfWeek
	        });
	        // Some clicks in the datepicker dialog are not stopped by the
	        // datepicker and "bubble through", unexpectedly triggering the bus's
	        // click event. Prevent that.
	        this.picker('widget').click(function (e) { e.stopPropagation(); });

	        this.$el.find('img.oe_datepicker_trigger').click(function() {
	            if (self.get("effective_readonly") || self.picker('widget').is(':visible')) {
	                self.$input.focus();
	                return;
	            }
	            self.picker('setDate', self.get('value') ? instance.web.auto_str_to_date(self.get('value')) : new Date());
	            self.$input_picker.show();
	            self.picker('show');
	            self.$input_picker.hide();
	        });
	        this.set_readonly(false);
	        this.set({'value': false});
	        /************advance search*************/
	        console.log(this);       
            	if(this.$input[0].name == ""){
		    	this.$el.css("display","inline-block");
		    	var islamic = this.$el.find(".islamic_rmb");
		    	islamic.hide();            	
		}
		/***************advance search*****************/
	        
	    },
    	on_picker_select: function(text, instance_) {
	        var date = this.picker('getDate');
	        this.$input
	            .val(date ? this.format_client(date) : '')
	            .change();	        
	        input2 = this.$input.prevObject[0].children[1];
	        var xmlString = input2, parser = new DOMParser(), doc = parser.parseFromString(xmlString, "text/html");
	        input2 = xmlString.getElementsByTagName("input");
	        var ifname = input2[0].name;
	        this.convert_gregorian_hijri(date ? this.format_client(date) : '', ifname);	        
	    },
	    set_value: function(value_) {
	        this.set({'value': value_});
	        this.$input.val(value_ ? this.format_client(value_) : '');	        
	        input2 = this.$input.prevObject[0].children[1];
	        var xmlString = input2, parser = new DOMParser(), doc = parser.parseFromString(xmlString, "text/html");
	        input2 = xmlString.getElementsByTagName("input");
   	        var ifname = input2[0].name;
   	        this.convert_gregorian_hijri(value_ ? this.format_client(value_) : '', ifname);
	    },
	    convert_gregorian_hijri: function(text, ifname) {
	    if (text) {
            	if(typeof(text) == "string"){
		            if (text.indexOf('-')!= -1){
	            		text_split = text.split('-');
	            		year = parseInt(text_split[0]);
	            		month = parseInt(text_split[1]);
	            		day = parseInt(text_split[2]);			
						calendar = $.calendars.instance('gregorian');
						calendar1 = $.calendars.instance('islamic');			
	            		var jd = calendar.toJD(year,month,day);
	                	var date = calendar1.fromJD(jd);
				
	            	}            	
	            	if(text.indexOf('/')!= -1){            		
	            		text_split = text.split('/');
//	            		year = parseInt(text_split[2]);
//	            		month = parseInt(text_split[0]);
//	            		day = parseInt(text_split[1]);
                                year = parseInt(text_split[2]);
                                month = parseInt(text_split[1]);
                                day = parseInt(text_split[0]);
						calendar = $.calendars.instance('gregorian');
						calendar1 = $.calendars.instance('islamic');			
	            		var jd = calendar.toJD(year,month,day);
	                	var date = calendar1.fromJD(jd);                	
				
	            	}
	            }else{
	            	year = parseInt(text.getFullYear());
            		month = parseInt(text.getMonth());
            		day = parseInt(text.getDay());			
					calendar = $.calendars.instance('gregorian');
					calendar1 = $.calendars.instance('islamic');			
            		var jd = calendar.toJD(year,month,day);
                	var date = calendar1.fromJD(jd);
	            }            	
            	m = (date.month() >=10 ? date.month():"0"+date.month());
            	d = (date.day() >=10 ? date.day():"0"+date.day());
            	$('.islamic_rmb input[name=' + ifname + ']').val(calendar1.formatDate('M d, yyyy', date));
            }
        },
        change_datetime: function(e) {
				this.set_value_from_ui_();
				this.trigger("datetime_changed");        
		},
    });
    instance.web.form.FieldDatetime.include({    	
    	initialize_content: function() {
    		res_obj.call("get_calendear_localisation", []).then(function(result) {
	    		lang = result['lang'];
				date_format = result['date_format'];
	    	});
	        if (!this.get("effective_readonly")) {
	            this.datewidget = this.build_widget();
	            this.datewidget.on('datetime_changed', this, _.bind(function() {
	                this.internal_set_value(this.datewidget.get_value());
	            }, this));
	            this.datewidget.appendTo(this.$el);
	            this.setupFocus(this.datewidget.$input);
	            var self = this;
	            function convert_date_hijri(date) {					
					if (!date) {
						return false
					}
						
					var jd = $.calendars.instance('islamic').toJD(parseInt(date[0].year()),parseInt(date[0].month()),parseInt(date[0].day()));
					var date = $.calendars.instance('gregorian').fromJD(jd);
					var date_value = new Date(parseInt(date.year()),parseInt(date.month())-1,parseInt(date.day()));
					self.datewidget.$input.val(date_value.$format(date_format));
            		self.datewidget.change_datetime();
				} 
				$('.islamic_rmb input.oe_hijri').calendarsPicker({				   
						calendar: $.calendars.instance('islamic',lang),
						dateFormat: 'M d, yyyy',
						showTrigger: '#calImg',
						onSelect: convert_date_hijri,						
				});
	        }	        	
	    },
	    convert_gregorian_hijri: function(text) {
	    	if (text) {
            	if (text.indexOf('-')!= -1){
            		text_split = text.split('-');
            		year = parseInt(text_split[0]);
            		month = parseInt(text_split[1]);
            		day = parseInt(text_split[2]);
					calendar = $.calendars.instance('gregorian');
	    	        calendar1 = $.calendars.instance('islamic');
            		var jd = $.calendars.instance('gregorian').toJD(year,month,day);
                	var date = $.calendars.instance('islamic').fromJD(jd);
            	}
            	if(text.indexOf('/')!= -1){
            		text_split = text.split('/');
//            		year = parseInt(text_split[2]);
//            		month = parseInt(text_split[0]);
//            		day = parseInt(text_split[1]);
                        year = parseInt(text_split[2]);
                        month = parseInt(text_split[1]);
                        day = parseInt(text_split[0]);
					calendar = $.calendars.instance('gregorian');
	                calendar1 = $.calendars.instance('islamic');	
            		var jd = calendar.toJD(year,month,day);
                	var date = calendar1.fromJD(jd);
            	}
            	return (calendar1.formatDate('M d, yyyy', date));
            }
            return '';
        },
	    render_value: function() {
	        if (!this.get("effective_readonly")) {
	            this.datewidget.set_value(this.get('value'));
	        } else {
	            var value = instance.web.format_value(this.get('value'), this, '');
	            this.$el.text(value); 
	            this.$el.append("<br>"+this.convert_gregorian_hijri(value));
	        }
	    },
    });    
};
