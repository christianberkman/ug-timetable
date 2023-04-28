/**
 * UG-Timetable
 * Main JS File
 * by Christian Berkman 2023
 */

//
// DayJS
//
dayjs.extend(dayjs.extend(window.dayjs_plugin_isBetween))
dayjs.extend(dayjs.extend(window.dayjs_plugin_isSameOrBefore))
dayjs.extend(dayjs.extend(window.dayjs_plugin_isSameOrAfter))
dayjs.extend(dayjs.extend(window.dayjs_plugin_relativeTime))
const today = dayjs()
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
    export var items = []

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
            console.log(this.progress())
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
            const remaining = this.end.diff(today, 'd') + 1
            if(remaining == 1 && this.end.isSame(today)) return 'today'
            else return remaining
        }

        /**
         * Weeks
         */
        weeks(){
            const rounded = Math.round( this.end.diff(this.start, 'w', true) )
            if(rounded == 0) return 1;
            else return rounded;
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
            return Math.ceil( this.end.add(1, 'd').diff(today, 'w', true) )
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

            if(length == 1 && today.isSame(this.end)) return 'today';
            else return length
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

// 
// Rendering
//
var prototypes = ''
const noDetails = '<em>No details.</em>'
    export function render(){
        return new Promise( (resolve, reject) => {
            $.get('./item-prototypes.html', (data) => {
                prototypes = $($.parseHTML(data))
            }).then( () => {
                items.forEach(item => {
                    switch(item.type){
                        case 'period':
                            if(item.isActive) renderActivePeriod(item)
                            else if (item.hasStarted == false) renderUpcomingPeriod(item)
                            else; // do not render
                        break;
                        case 'event':
                            if(item.isActive) renderActiveEvent(item)
                            else if(item.inFuture) renderUpcomingEvent(item)
                            else; // do not render
                        break;
                    }
                }) // forEach

                resolve(true)
            }) // get.then
            
        }) // promise
        
    }

    async function renderActivePeriod(item){
        console.log('Rendering active period ' + item.name)
        const newDiv = $(prototypes.filter('.ugt-active-period')).clone()
        
            newDiv.find('.ugt-name').text(item.name)
            newDiv.find('.ugt-icon').addClass(item.icon)
    
            newDiv.find('.ugt-ends-in').text( item.endsInString() )

            newDiv.find('.ugt-progress').attr('style', "width: " + item.progress() + "%")
            newDiv.find('.ugt-start').text(item.start.format('MMM D'))
                newDiv.find('.ugt-current-week').text(item.currentWeek())
                newDiv.find('.ugt-weeks').text(item.weeks())
            newDiv.find('.ugt-end').text(item.end.format('MMM D'))

            newDiv.find('.ugt-since').text(item.startedSinceString())
            newDiv.find('.ugt-weeks-remaining').text(item.weeksRemaining())
            newDiv.find('.ugt-days').text(item.days())
            newDiv.find('.ugt-days-remaining').text(item.daysRemaining())
            newDiv.find('.ugt-weekdays').text(item.weekDays())
            newDiv.find('.ugt-weekdays-remaining').text(item.weekDaysRemaining())  

            newDiv.find('.ugt-details').html(item.details ?? '')

            newDiv.removeClass('d-none')
        $('#ugt-items').append(newDiv)
    }

    async function renderUpcomingPeriod(item){
        console.log('Rendering upcoming period ' + item.name)
        const newDiv = $(prototypes.filter('.ugt-upcoming-period')).clone()
        
            newDiv.find('.ugt-name').text(item.name)
            newDiv.find('.ugt-icon').addClass(item.icon)

            newDiv.find('.ugt-starts-in').text( item.startsInString() )
            
            newDiv.find('.ugt-start').text(item.start.format('MMM D'))
            newDiv.find('.ugt-weeks').text(item.weeks())
            newDiv.find('.ugt-end').text(item.end.format('MMM D'))

            newDiv.find('.ugt-days').text(item.days())
            newDiv.find('.ugt-weekdays').text(item.weekDays())

            newDiv.find('.ugt-details').html(item.details ?? '')

            newDiv.removeClass('d-none')
        $('#ugt-items').append(newDiv)
    }

    async function renderActiveEvent(item){
        console.log('Rendering active event '+ item.name)

        const newDiv = $(prototypes.filter('.ugt-active-event')).clone()
            newDiv.find('.ugt-name').text(item.name)
            newDiv.find('.ugt-start').text( item.start.format('MMMM D') )
            newDiv.find('.ugt-icon').addClass(item.icon)
            newDiv.find('.ugt-details').html(item.details ?? noDetails)

            newDiv.removeClass('d-none')
        $('#ugt-items').append(newDiv)
    }
    
    async function renderUpcomingEvent(item){
        console.log('Rendering upcoming event '+ item.name)

        const newDiv = $(prototypes.filter('.ugt-upcoming-event')).clone()
        newDiv.find('.ugt-name').text(item.name)
        newDiv.find('.ugt-starts-in').text(item.startsInString())
        newDiv.find('.ugt-icon').addClass(item.icon)
        newDiv.find('.ugt-start').text( item.start.format('MMMM D') )
        newDiv.find('.ugt-details').html(item.details ?? noDetails)

        newDiv.removeClass('d-none')
    $('#ugt-items').append(newDiv)
    }


