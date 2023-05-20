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
    import * as ugt_items from './ugt-items.js';
    import * as ugt_render from './ugt-render.js';
    const ugt = { 
        items: ugt_items,
        render: ugt_render
    }

    // Load and Render data
    $.getJSON("data.json", data => {
        ugt.items.load(data)
        ugt.render.render(ugt.items.get())
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

//
// Service Worker
//
const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/serviceworker.js", {
          scope: "/",
        });
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };
  registerServiceWorker();
