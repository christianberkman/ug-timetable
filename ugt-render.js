/**
 * UG Timetable
 * Render Module
 * By Christian Berkman, 2023
 */

var prototypes = null
const noDetails = '<em>No details.</em>'
    
    export function version(version){
        $('#version').text(version)
    }

    export function render(items){
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
            newDiv.find('.ugt-start').text(item.start.format('ddd MMM D'))
                newDiv.find('.ugt-progress-string').text(item.progressString())
            newDiv.find('.ugt-end').text(item.end.format('ddd MMM D'))

            newDiv.find('.ugt-weeks').text(item.weeks())
            newDiv.find('.ugt-since').text(item.startedSinceString())
            newDiv.find('.ugt-weeks-remaining').text(item.weeksRemainingString())
            newDiv.find('.ugt-days').text(item.days())
            newDiv.find('.ugt-days-remaining').text(item.daysRemainingString())
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
            
            newDiv.find('.ugt-start').text(item.start.format('ddd MMM D'))
                newDiv.find('.ugt-length-string').text(item.lengthString())
            newDiv.find('.ugt-end').text(item.end.format('ddd MMM D'))

            newDiv.find('.ugt-weeks').text(item.weeksString())
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
            newDiv.find('.ugt-start').text( item.start.format('dddd MMMM D') )
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
        newDiv.find('.ugt-start').text( item.start.format('dddd MMMM D') )
        newDiv.find('.ugt-details').html(item.details ?? noDetails)

        newDiv.removeClass('d-none')
    $('#ugt-items').append(newDiv)
    }


