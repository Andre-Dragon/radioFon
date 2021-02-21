'use strict';

/************* radio player *************/

const radioPlayerInit = () => 
{

  const $radioHeader = document.querySelector( '.radio__header' );
  const $radioHeaderBig = document.querySelector( '.radio-header__big' );
  const $radioCoverImg = document.querySelector( '.radio-cover__img' );
  const $radioNavigation = document.querySelector( '.radio__navigation' ); 
  const $radioItem = document.querySelectorAll( '.radio__item' ); 
  const $radioBtnStop = document.querySelector( '.radio-btn__stop' );   

  const audio = new Audio();
  audio.type = 'audio/aac';

  $radioBtnStop.disabled = true;

  const changeBtnPlay = () => 
  {

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

  const selectItem = el => 
  {
    
    for ( let el of $radioItem ) {
      el.classList.remove( 'select' );
    }
    el.classList.add( 'select' );

  };

  $radioNavigation.addEventListener( 'change', event => 
  {
    const target = event.target;
    const parent = target.closest( '.radio__item' );

    const title = parent.querySelector( '.radio__name' ).textContent;
    const urlImg = parent.querySelector( '.radio__img' ).src;
    $radioHeaderBig.textContent = title;
    $radioCoverImg.src = urlImg;


    $radioBtnStop.disabled = false;
    audio.src = target.dataset.radioStantion;

    audio.play();
    changeBtnPlay();
    selectItem( parent );

  });

  $radioBtnStop.addEventListener( 'click', () => 
  {
    
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

const multiItemSlider = ( () => 
{

  const _isElementVisible = element => 
  {
    const rect = element.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      elemFromPoint = ( x, y ) => 
      { 
        return document.elementFromPoint( x, y ); 
      };

    if ( rect.right < 0 || rect.bottom < 0 || 
      rect.left > vWidth || rect.top > vHeight )
      {
        return false;
      }

    return (
      element.contains( elemFromPoint( rect.left, rect.top ) ) || 
      element.contains( elemFromPoint( rect.right, rect.top ) ) || 
      element.contains( elemFromPoint( rect.right, rect.bottom ) ) || 
      element.contains( elemFromPoint( rect.left, rect.bottom ) )
    );
  };

  return ( selector, config ) => {
    let
      _mainElement = document.querySelector( selector ),
      _radioSlider = _mainElement.querySelector( '.radio__slider' ),
      _radioItems = _mainElement.querySelectorAll( '.radio__item' ),
      _sliderControls = _mainElement.querySelectorAll( '.slider__control' ),
      _sliderControlPrev = _mainElement.querySelector( '.slider-control__prev' ),
      _sliderControlNext = _mainElement.querySelector( '.slider-control__next' ),
      _wrapperWidth = parseFloat( getComputedStyle( _radioSlider ).width ),
      _itemWidth = parseFloat( getComputedStyle( _radioItems[0] ).width ),
      _html = _mainElement.innerHTML,
      _positionLeftItem = 0,
      _transform = 0,
      _step = _itemWidth / _wrapperWidth * 100,
      _items = [],
      _interval = 0,
      _states = [
        { active: false, minWidth: 0, count: 1 },
        { active: false, minWidth: 520, count: 2 },
        { active: false, minWidth: 698, count: 3 },
        { active: false, minWidth: 960, count: 4 },
      ],
      _config = {
        isCycling: false,
        direction: 'right',
        interval: 5000,
        pause: true
      };

    for ( let key in config ) 
    {
      if ( key in _config ) {
        _config[key] = config[key];
      }
    }

    let index, count;
    count = _radioItems.length;
    for ( index = 0; index < count; index++ ) 
    {
      _items.push({ item: _radioItems[index], position: index, transform: 0 });
    }

    const _setActive = () => 
    {
      let _index = 0;
      let index, count;
      const width = parseFloat( document.body.clientWidth );
      count = _states.length;

      for ( index = 0; index < count; index++ ) 
      {
        _states[index].active = false;
        if ( width >= _states[index].minWidth ) 
        {
          _index = index;
        }
      }

      _states[_index].active = true;
    };

    const _getActive = () => 
    {
      let _index;
      let index, count;
      count = _states.length;

      for ( index = 0; index < count; index++ ) 
      {
        if ( _states[index].active ) 
        {
          _index = index;
        }
      }

      return _index;
    };

    const position = 
    {
      getItemMin() {
        let indexItem = 0;
        let index, count;
        count = _items.length;

        for ( index = 0; index < count; index++ ) 
        {
          if ( _items[index].position < _items[indexItem].position ) 
          {
            indexItem = index;
          }
        }

        return indexItem;
      },

      getItemMax() 
      {
        let indexItem = 0;
        let index, count;
        count = _items.length;

        for ( index = 0; index < count; index++ ) 
        {
          if ( _items[index].position > _items[indexItem].position ) 
          {
            indexItem = index;
          }
        }

        return indexItem;
      },

      getMin() {
        return _items[position.getItemMin()].position;
      },

      getMax() 
      {
        return _items[position.getItemMax()].position;
      }

    };

    const _transformItem = direction => 
    {
      let nextItem;
      if ( !_isElementVisible( _mainElement ) ) 
      {
        return;
      }
      if ( direction === 'right' ) {
        _positionLeftItem++;
        
        if ( ( _positionLeftItem + _wrapperWidth / _itemWidth - 1 ) > position.getMax() ) 
        {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform -= _step;
      }

      if ( direction === 'left' ) {
        _positionLeftItem--;

        if ( _positionLeftItem < position.getMin() ) 
        {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform += _step;
      }

      _radioSlider.style.transform = 'translateX(' + _transform + '%)';
    };

    const _cycle = direction => 
    {
      if ( !_config.isCycling ) 
      {
        return;
      }

      _interval = setInterval( () => 
      {
        _transformItem( direction );
      }, _config.interval );
    };

    const _controlClick = e => 
    {
      if ( e.target.classList.contains( 'slider__control' ) ) 
      {
        e.preventDefault();
        const direction = e.target.classList.contains( 'slider-control__next' ) ? 'right' : 'left';
        _transformItem( direction );
        clearInterval( _interval );
        _cycle( _config.direction );
      }
    };

    const _handleVisibilityChange = () => 
    {
      if ( document.visibilityState === 'hidden' ) 
      {
        clearInterval( _interval );
      } else {
        clearInterval( _interval );
        _cycle( _config.direction );
      }
    };

    const _refresh = () => 
    {
      clearInterval( _interval );
      _mainElement.innerHTML = _html;
      _radioSlider = _mainElement.querySelector( '.radio__slider' );
      _radioItems = _mainElement.querySelectorAll( '.radio__item' );
      _sliderControls = _mainElement.querySelectorAll( '.slider__control' );
      _sliderControlPrev = _mainElement.querySelector( '.slider-control__prev' );
      _sliderControlNext = _mainElement.querySelector( '.slider-control__next' );
      _wrapperWidth = parseFloat( getComputedStyle( _radioSlider ).width );
      _itemWidth = parseFloat( getComputedStyle( _radioItems[0] ).width );
      _positionLeftItem = 0;
      _transform = 0;
      _step = _itemWidth / _wrapperWidth * 100;
      _items = [];
      var index, count;
      count = _radioItems.length;
      for ( index = 0; index < count; index++ ) 
      {
        _items.push({ item: _radioItems[index], position: index, transform: 0 });
      }
    };

    const _setUpListeners = () => 
    {
      _mainElement.addEventListener( 'click', _controlClick );
      if ( _config.pause && _config.isCycling ) 
      {
        _mainElement.addEventListener( 'mouseenter', () =>
        {
          clearInterval( _interval );
        });
        _mainElement.addEventListener( 'mouseleave', () => 
        {
          clearInterval( _interval );
          _cycle( _config.direction );
        });
      }

      document.addEventListener( 'visibilitychange', _handleVisibilityChange, false );
      window.addEventListener( 'resize', () => 
      {
        let
          _index = 0,
          width = parseFloat( document.body.clientWidth );
        let index, count;
        count = _states.length;
        for ( index = 0; index < count; index++ ) 
        {
          if ( width >= _states[index].minWidth ) 
          {
            _index = index;
          }
        }
        if ( _index !== _getActive() ) 
        {
          _setActive();
          _refresh();
        }
      });
    };

    // инициализация
    _setUpListeners();

    if ( document.visibilityState === 'visible' ) 
    {
      _cycle( _config.direction );
    }
    _setActive();

    return {
      right() 
      {
        _transformItem( 'right' );
      },

      left() 
      {
        _transformItem( 'left' );
      },

      stop() 
      {
        _config.isCycling = false;
        clearInterval( _interval );
      },

      cycle() 
      {
        _config.isCycling = true;
        clearInterval( _interval );
        _cycle();
      }
    };

  };
})();

const slider = multiItemSlider( '.slider__carousel', 
{
  isCycling: true,
});


















