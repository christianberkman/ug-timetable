/**
 * UG-Timetable
 * Items Module
 * by Christian Berkman 2023
 */

//
// DayJS
//
dayjs.extend(dayjs.extend(window.dayjs_plugin_isBetween))
dayjs.extend(dayjs.extend(window.dayjs_plugin_isSameOrBefore))
dayjs.extend(dayjs.extend(window.dayjs_plugin_isSameOrAfter))
dayjs.extend(dayjs.extend(window.dayjs_plugin_relativeTime))
const today = dayjs( dayjs().format('YYYY-MM-DD') )
console.log( 'Today is ' + today.format() )
const tomorrow = today.add(1, 'd')
const yesterday = today.subtract(1, 'd')
const weekDays = [1,2,3,4,5]

/**
 * Return is date is a weekday
 * Thanks to https://github.com/soar-tech/dayjs-business-days/blob/develop/src/index.js dayjsClass.prototype.isBusinessDy 
 */
function isWeekDay(date){
    if(weekDays.includes(date.day())) return true
    else return false
}

//
// Data
//
    var items = []
    export function get(){ return items }

    /**
     * Fill data array with classes
     */
    export function load(data){
        // Sort by start
        const sorted = data.sort( (a,b) => {
            return a.start > b.start ? 1 : -1;
        })

        // Create class objects
        sorted.forEach(item => {
            switch(item.type){
                case 'period': items.push( new Period(item) ); break;
                case 'event': items.push( new Event(item) ); break;
            }
        })

        return true
    }

    /**
     * Class Period
     */
    class Period{
        constructor(data, type){
            this.type = data.type
            this.name = data.name
            this.icon = data.icon
            this.start = dayjs(data.start)
            this.end = dayjs(data.end)
            this.isActive = this._isActive()
            this.hasStarted = this._hasStarted()
            this.hasEnded = this._hasEnded()
        }


        _isActive(){
            return today.isBetween(this.start, this.end, 'day', '[]')
        }

        _hasStarted(){
            return today.isSameOrAfter(this.start)
        }

        _hasEnded(){
            return today.isAfter(this.end)
        }

        progress(){
            if(this.hasEnded == true) return 100
            if(this.hasStarted == false) return 0
            if(this.end.isSame(today)) return Math.round( ( (this.currentDay()-1) / this.days()  * 100 ))
            
            return Math.round( (this.currentDay() / this.days()) * 100 )
        }

        progressString(){
            if(this.days() < 14) return 'day ' + this.currentDay() + ' of ' + this.days()
            else return 'week ' + this.currentWeek() + ' of ' + this.weeks()
        }

        lengthString(){
            if(this.days() < 14) return this.days() + ' days'
            else return this.weeks() + ' weeks'
        }

        /**
         * Days
         */
        days(){
            return this.end.diff(this.start, 'd') + 1
        }

        startsIn(unit = 'd'){
            return this.start.diff(today, unit)
        }

        startsInString(){
            const startsIn = this.startsIn()
            
            switch(startsIn){
                case 1: return 'starts tomorrow'; break;
                case 0: return 'starts today'; break;
                default: return 'starts ' + today.to(this.start)
            }
        }
        
        startedSince(unit = 'd'){
            return today.diff(this.start, unit)
        }

        startedSinceString(){
            const startedSince = this.startedSince()

            switch(startedSince){
                case 0: return 'today'; break;
                case 1: return 'yesterday'; break;
                default: return this.start.from(today)
                
            }
        }

        endsIn(unit = 'd'){
            return this.end.diff(today, unit)
        }

        endsInString(){
            const endsIn = this.endsIn()
            switch(endsIn){
                case 1: return 'ends tomorrow'; break;
                case 0: return 'ends today'; break;
                default: return 'ends ' + today.to(this.end)
            }
        }

        currentDay(){
            // Period not yet started
            if(today.isSameOrBefore(this.start)) false;

            // Period ended
            if(today.isAfter(this.end)) return false;

            // active period
            return -this.startsIn('d')+1
        }

        daysRemaining(){
            // Period not yet started
            if(today.isSameOrBefore(this.start)) return this.days()
            
            // Period ended 
            if(today.isAfter(this.end)) return 0;

            // Period is active
            return this.end.diff(today, 'd') + 1
        }

        daysRemainingString(){
            const remaining = this.daysRemaining()
            if(remaining ==2) return 'tomorrow'
            if(remaining == 1) return 'today'
            else return remaining
        }

        /**
         * Weeks
         */
        weeks(){
            return Math.round( this.end.diff(this.start, 'w', true) )
        }

        weeksString(){
            const weeks = this.weeks()
            if(weeks == 0) return 'less than 1'
            else return weeks
        }

        currentWeek(){
            // Period not yet started
            if(today.isSameOrBefore(this.start)) false;

            // Period ended
            if(today.isAfter(this.end)) return false;

            // active period
            return -this.startsIn('w', 'true')+1
        }

        weeksRemaining(){
            // Period not yet started
            if(today.isSameOrBefore(this.start)) return this.weeks()
            
            // Period ended 
            if(today.isAfter(this.end)) return 0;

            // Period is active
            //return Math.round( this.end.add(1, 'd').diff(today, 'w', true) )
            return this.weeks() - this.currentWeek()+1
        }

        weeksRemainingString(){
            const weeks = this.weeksRemaining()
            if(weeks == 2) return 'next week'
            if(weeks == 1) return 'this week'
            return weeks
        }


        /**
         * Weekdays
         */ 
        weekDays(){
        /* Thanks to https://github.com/soar-tech/dayjs-business-days/blob/develop/src/index.js : dayjsClass.prototype.businessDiff */
            var checkDate = this.start
            var length = 0
            while(checkDate.isSameOrBefore(this.end)){
                if(isWeekDay(checkDate)) length += 1
                checkDate = checkDate.add(1, 'd')
            }

            return length
        }

        weekDaysRemaining(){
            // Period not yet started
            if(today.isSameOrBefore(this.start)) return this.weekDays()

            // Period ended
            if(today.isAfter(this.end)) return 0;
            
            var checkDate = today
            var length = 0
            while(checkDate.isSameOrBefore(this.end)){
                if(isWeekDay(checkDate)) length += 1
                checkDate = checkDate.add(1, 'd')
            }

            return length
        }
    }

    /**
     * Event Class
     */
    class Event{
        constructor(data){
            this.type = data.type
            this.name = data.name
            this.icon = data.icon
            this.details = data.details
            this.start = dayjs(data.start)
            this.isActive = this._isActive()
            this.inFuture = this._inFuture()
        }

        _isActive(){
            return this.start.isSame(today, 'day')
        }

        _inFuture(){
            return this.start.isAfter(today)
        }

        startsIn(unit = 'd'){
            return this.start.diff(today, unit)
        }

        startsInString(){
            const startsIn = this.startsIn()
            
            switch(startsIn){
                case 1: return 'tomorrow'; break;
                case 0: return 'today'; break;
                default: return today.to(this.start)
            }
        }
    }
