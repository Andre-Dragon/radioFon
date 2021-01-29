'use strict';

/************* radio player *************/

const radioPlayerInit = () => {

  const $radioHeader = document.querySelector( '.radio__header' );
  const radioHeaderBig = document.querySelector( '.radio-header__big' );
  const $radioCoverImg = document.querySelector( '.radio-cover__img' );
  const $radioNavigation = document.querySelector( '.radio__navigation' ); 
  const $radioItem = document.querySelectorAll( '.radio__item' ); 
  const $radioBtnStop = document.querySelector( '.radio-btn__stop' );   

  const audio = new Audio();
  audio.type = 'audio/aac';

  $radioBtnStop.disabled = true;

  const changeBtnPlay = () => {

    if ( audio.paused ) {
      $radioHeader.classList.remove( 'play' );
      $radioBtnStop.classList.add( 'radio__play' );
      $radioBtnStop.classList.remove( 'radio__stop' );
    } else {
      $radioHeader.classList.add( 'play' );
      $radioBtnStop.classList.add( 'radio__stop' );
      $radioBtnStop.classList.remove( 'radio__play' );
    }

  };

  const selectItem = el => {
    
    for ( let el of $radioItem ) {
      el.classList.remove( 'select' );
    }
    el.classList.add( 'select' );

  };

  $radioNavigation.addEventListener( 'change', event => {
    const target = event.target;
    const parent = target.closest( '.radio__item' );

    const title = parent.querySelector( '.radio__name' ).textContent;
    const urlImg = parent.querySelector( '.radio__img' ).src;
    radioHeaderBig.textContent = title;
    $radioCoverImg.src = urlImg;


    $radioBtnStop.disabled = false;
    audio.src = target.dataset.radioStantion;

    audio.play();
    changeBtnPlay();
    selectItem( parent );

  });

  $radioBtnStop.addEventListener( 'click', () => {
    
    if ( audio.paused ) {
      audio.play();
    } else {
      audio.pause();
    }

    changeBtnPlay();

  });

};
radioPlayerInit();


/************* radio slaider *************/

const radioSlaiderInit = () => {

  const $radioSlaider = document.querySelector( '.radio__slaider' );
  // const $slaiderWidth = parseFloat( getComputedStyle( $radioSlaider ).width );
  const $slides = document.querySelectorAll( '.radio__item' );
  // const $slidesWidth = parseFloat( getComputedStyle( $slides[0] ).width );
  const $containerBtnPrev = document.querySelector( '.container-btn__prev' );
  const $containerBtnNext = document.querySelector( '.container-btn__next' );
  const $btnPrev = document.querySelector( '.btn__prev' );
  const $btnNext = document.querySelector( '.btn__next' );

  let position = 0;
  let numMax = 0;
  const maxSlide = $slides.length;

  const goToSlide = slide => {
    $slides.forEach(
      ( s, i ) => ( s.style.transform = `translateX( ${100 * (i - slide)}% )` )
    );
  };

  const checkBtns = () => {
    
    if ( position <= 0 ) {
      $btnPrev.classList.add( 'btn__hide' );
      $containerBtnPrev.classList.add( 'btn__hide' );
    } else {
      $btnPrev.classList.remove( 'btn__hide' );
      $containerBtnPrev.classList.remove( 'btn__hide' );
    }

    if ( position >= ( maxSlide - numMax ) ) {
      $btnNext.classList.add( 'btn__hide' );
      $containerBtnNext.classList.add( 'btn__hide' );
    } else {
      $btnNext.classList.remove( 'btn__hide' );
      $containerBtnNext.classList.remove( 'btn__hide' );
    }

    if ( document.body.clientWidth >= 921 ) {
      numMax = 4;
    } else if ( document.body.clientWidth >= 699 ) {
      numMax = 3;
    } else if ( document.body.clientWidth >= 521 ) {
      numMax = 2;
    } else {
      numMax = 1;
    }
  };

  // Next slide
  const nextSlide = event => {
    event.preventDefault();

    // if ( ( position + ( $slaiderWidth / $slidesWidth ) - 1 ) < ( maxSlide - 1 ) && 
    // position !== ( maxSlide - 1 ) ) {
    //   position++;
    // }

    if ( position  !== ( maxSlide - numMax ) ) {
      position++;
    }

    checkBtns();
    goToSlide( position );
  };

  // Prev slide
  const prevSlide = event => {
    event.preventDefault();

    if ( position !== 0 ) {
      position--;
    }

    checkBtns();
    goToSlide( position );
  };

  const init = () => {
    goToSlide( 0 );
  };

  init();

  // Event handlers
  $containerBtnNext.addEventListener( 'click', nextSlide );
  $containerBtnPrev.addEventListener( 'click', prevSlide );

  checkBtns();
  
};

radioSlaiderInit();