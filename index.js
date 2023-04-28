/**
  UG Timetable
  JS file for index.html
  by Christian Berkman 2023
*/

// Dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $('html').attr('data-bs-theme', 'dark')
 }
 
 //
 // UG-Timetable
 //
    import * as ugt from './ug-timetable.js';

    // Load and Render data
    $.getJSON("data.json", data => {
        ugt.load(data)
        ugt.render()
    })

    // Hide
    $('body').on('click', '.link-hide', function(){
        $(this).parents('.ugt-item').hide()
        $('#link-restore').removeClass('d-none')
    })

    // Custom Collapse
    $('body').on('click', '.link-details', function(){
        console.log('click')
        $(this).find('i').toggleClass('bi-chevron-down')
        $(this).find('i').toggleClass('bi-chevron-up')

        $(this).parents('.ugt-item').find('.collapse').toggle('fast', 'swing')
    })

