/** 
 * Constants
 */
const today = dayjs('2023-05-06') // for debugging

/**
 * Return if a day is a school day
 * Thanks tohttps://github.com/soar-tech/dayjs-business-days/blob/develop/src/index.js :  dayjsClass.prototype.isBusinessDay
 */
function isSchoolDay(date){
    const schoolDays = [1,2,3,4,5] // Mon-Sat
    if( schoolDays.includes(date.day()) ) return true;
    else return false;
}

/**
 * Day.js plugins
 */
dayjs.extend(dayjs.extend(window.dayjs_plugin_isBetween))
dayjs.extend(dayjs.extend(window.dayjs_plugin_isSameOrBefore))

class olunaku{
    constructor(config){
        console.log('Olunaku');
        this.config = config

        // Terms
        this.terms = []
        this.config.terms.forEach(term => {
            this.terms.push( new Period(term, 'term') )
        });

        // Holidays
        this.holidays = []
        this.config.holidays.forEach(holiday => {
            this.holidays.push( new Period(holiday, 'holiday') )
        });
    }

    currentPeriod(){
        if(this.currentTerm()) return this.currentTerm()
        else return this.currentHoliday()
    }

    currentTerm(){    
        var currentTerm = false
        this.terms.every(term => {
            if(term.isCurrent()) { currentTerm = term; return false }
            return true
        })

        return currentTerm
    }   

    currentHoliday(){
        var currentHoliday = false
        this.holidays.every(holiday => {
            if(holiday.isCurrent()) { currentHoliday = holiday; return false }
            return true
        })

        return currentHoliday
    }

}

class Period{
    constructor(config, type){
        this.name = config.name
        this.type = type
        this.start = dayjs(config.start)
        this.end = dayjs(config.end)
    }

    isCurrent(){
        return today.isBetween(this.start, this.end, 'day', '[]')
    }

    lengthInDays(){
        return this.end.diff(this.start, 'd') + 1
    }

    lengthInWeeks(){
        return Math.ceil( this.end.diff(this.start, 'w', true) )
    }

    /**
     * Return number of school days in period
     * Thanks to https://github.com/soar-tech/dayjs-business-days/blob/develop/src/index.js : dayjsClass.prototype.businessDiff 
     */
    lengthInSchoolDays(){
        var checkDate = this.start
        var length = 0
        while(checkDate <= this.end){
            if(isSchoolDay(checkDate)) length += 1
            checkDate = checkDate.add(1, 'd')
        }

        return length
    }

    startsIn(unit = 'd'){
        return this.start.diff(today, unit)
    }

    endsIn(unit = 'd'){
        return this.end.diff(today, unit)
    }

    /**
     * Return the current day
     */
    currentDay(){
        // Period not yet started
        if(today.isSameOrBefore(this.start)) false;

        // Period ended
        if(today.isAfter(this.end)) return false;

        // Current period
        return -this.startsIn('d')+1
    }

    /**
     * Return the current week
     */
    currentWeek(){
        // Period not yet started
        if(today.isSameOrBefore(this.start)) false;

        // Period ended
        if(today.isAfter(this.end)) return false;

        // Current period
        return -this.startsIn('w', 'true')+1
    }

    /**
     * Return number of days remaining in period
     */
    daysRemaining(){
        // Period not yet started
        if(today.isSameOrBefore(this.start)) return this.lengthInDays()
        
        // Period ended 
        if(today.isAfter(this.end)) return 0;

        // Period is current
        return this.end.diff(today, 'd') + 1
    }

    /**
     * Return number of school days remaning in period
     * Thanks to https://github.com/soar-tech/dayjs-business-days/blob/develop/src/index.js : dayjsClass.prototype.businessDiff 
     */
    schoolDaysRemaining(){
        // Period not yet started
        if(today.isSameOrBefore(this.start)) return this.lengthInSchoolDays()

        // Period ended
        if(today.isAfter(this.end)) return 0;
        
        var checkDate = today
        var length = 0
        while(checkDate <= this.end){
            if(isSchoolDay(checkDate)) length += 1
            checkDate = checkDate.add(1, 'd')
        }

        return length
    }

    /**
     * Return number of weeks remaining in period
     */
    weeksRemaining(){
        // Period not yet started
        if(today.isSameOrBefore(this.start)) return this.lengthInWeeks()
        
        // Period ended 
        if(today.isAfter(this.end)) return 0;

        // Period is current
        return Math.ceil( this.end.add(1, 'd').diff(today, 'w', true) )
    }
}
    