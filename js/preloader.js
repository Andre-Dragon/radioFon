document.body.onload = () => {
  'use strict';

  const $radioPreloader = document.getElementById( 'radio__preloader' );
  const $overlay = document.querySelector( '.overlay' );
  let images = document.images,
  imagesCount = images.length,
  loadedImg = 0;
  $radioPreloader.classList.remove( 'hide' );

  /************* radio title *************/

  const firsTitlePage = () => {

    setTimeout( () => {
      setTimeout( () => {
        $overlay.classList.add( 'hide' );
      }, 3100 );
      $overlay.classList.add( 'done' );
    }, 3000 );

  };

  /************* radio preloader *************/

    function imageLoaded() { 

      loadedImg++;

      if ( loadedImg >= imagesCount ) {
        setTimeout( () => {
          setTimeout( () => {
            $radioPreloader.classList.add( 'hide' );
          }, 3100 );
          if ( !$radioPreloader.classList.contains( 'done' ) ) {
            $radioPreloader.classList.add( 'done' );
            $overlay.classList.remove( 'hide' );
            firsTitlePage();
          }
        }, 3000 );
      }
      
    }

    for ( let i = 0; i < imagesCount; i++ ) {
      const imageCopy = new Image();
      imageCopy.src = images[i].src;
      imageCopy.onload = imageLoaded;
      imageCopy.onerror = imageLoaded;
    }

};