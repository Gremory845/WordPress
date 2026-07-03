
( function () {
    'use strict';

    /**
     * @param {HTMLElement} wrapper 
     */
    function initFAQ( wrapper ) {
        const items = wrapper.querySelectorAll( '.fib-item' );
        const triggers = wrapper.querySelectorAll( '.fib-trigger' );
        const searchInput = wrapper.querySelector( '.fib-search' );
        const clearBtn = wrapper.querySelector( '.fib-search-clear' );
        const noResults = wrapper.querySelector( '.fib-no-results' );

        if ( ! items.length ) return;

        /* ---- Acordeón ------------------------------------------ */

        /**
         * Abre un panel de respuesta con animación de max-height.
         * @param {HTMLElement} trigger
         * @param {HTMLElement} panel
         * @param {HTMLElement} item
         */
        function openPanel( trigger, panel, item ) {
            // Cerrar el que esté abierto si hay uno
            const currentOpen = wrapper.querySelector( '.fib-item.fib-open' );
            if ( currentOpen && currentOpen !== item ) {
                const openTrigger = currentOpen.querySelector( '.fib-trigger' );
                const openPanel   = currentOpen.querySelector( '.fib-panel' );
                closePanel( openTrigger, openPanel, currentOpen );
            }

            trigger.setAttribute( 'aria-expanded', 'true' );
            item.classList.add( 'fib-open' );

            panel.removeAttribute( 'hidden' );
            // Forzar reflow para activar la transición
            panel.style.maxHeight = '0px';
            panel.offsetHeight;
            panel.style.maxHeight = panel.scrollHeight + 'px';

            // Limpiar max-height al terminar para que sea responsive
            panel.addEventListener( 'transitionend', function onEnd() {
                panel.style.maxHeight = 'none';
                panel.removeEventListener( 'transitionend', onEnd );
            }, { once: true } );
        }

        /**
         * Cierra un panel con animación.
         * @param {HTMLElement} trigger
         * @param {HTMLElement} panel
         * @param {HTMLElement} item
         */
        function closePanel( trigger, panel, item ) {
            trigger.setAttribute( 'aria-expanded', 'false' );
            item.classList.remove( 'fib-open' );

            // Re-establecer max-height para animar el cierre
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.offsetHeight;
            panel.style.maxHeight = '0px';

            panel.addEventListener( 'transitionend', function onEnd() {
                panel.setAttribute( 'hidden', '' );
                panel.style.maxHeight = '';
                panel.removeEventListener( 'transitionend', onEnd );
            }, { once: true } );
        }

        /**
         * Toggle de un ítem del acordeón.
         * @param {HTMLElement} trigger
         */
        function toggleItem( trigger ) {
            const item  = trigger.closest( '.fib-item' );
            const panel = item.querySelector( '.fib-panel' );
            const isOpen = trigger.getAttribute( 'aria-expanded' ) === 'true';

            if ( isOpen ) {
                closePanel( trigger, panel, item );
            } else {
                openPanel( trigger, panel, item );
            }
        }

        // Eventos de clic en cada trigger
        triggers.forEach( function ( trigger ) {
            trigger.addEventListener( 'click', function () {
                toggleItem( trigger );
            } );

            // Soporte de teclado
            trigger.addEventListener( 'keydown', function ( e ) {
                if ( e.key === 'Escape' ) {
                    const item  = trigger.closest( '.fib-item' );
                    const panel = item.querySelector( '.fib-panel' );
                    if ( trigger.getAttribute( 'aria-expanded' ) === 'true' ) {
                        closePanel( trigger, panel, item );
                        trigger.focus();
                    }
                }
            } );
        } );

        /* ---- Buscador en tiempo real ---------------------------- */
        if ( ! searchInput ) return;

        /**
         * Normaliza texto quitando tildes y pasando a minúsculas.
         * @param {string} str
         * @returns {string}
         */
        function normalize( str ) {
            return str
                .toLowerCase()
                .normalize( 'NFD' )
                .replace( /[\u0300-\u036f]/g, '' );
        }

        /**
         * Resalta las coincidencias del término dentro de un texto.
         * @param {string} text   Texto original
         * @param {string} term   Término buscado
         * @returns {string} HTML con <mark> en las coincidencias
         */
        function highlight( text, term ) {
            if ( ! term ) return text;
            const escaped  = term.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
            const regex    = new RegExp( '(' + escaped + ')', 'gi' );
            return text.replace( regex, '<mark class="fib-mark">$1</mark>' );
        }

        let searchTimeout;

        function performSearch() {
            const rawTerm  = searchInput.value.trim();
            const term     = normalize( rawTerm );
            let   visible  = 0;

            clearBtn.hidden = ( rawTerm.length === 0 );

            items.forEach( function ( item ) {
                const preguntaEl  = item.querySelector( '.fib-pregunta-text' );
                const respuestaEl = item.querySelector( '.fib-respuesta' );

                const preguntaText  = normalize( preguntaEl.dataset.original || preguntaEl.textContent );
                const respuestaText = normalize( respuestaEl.dataset.original || respuestaEl.textContent );

                // Guardar texto original la primera vez
                if ( ! preguntaEl.dataset.original )  preguntaEl.dataset.original  = preguntaEl.textContent;
                if ( ! respuestaEl.dataset.original ) respuestaEl.dataset.original = respuestaEl.innerHTML;

                const matches = ! term ||
                    preguntaText.includes( term ) ||
                    respuestaText.includes( term );

                item.classList.toggle( 'fib-hidden',    ! matches );
                item.classList.toggle( 'fib-highlight',  matches && !! term );

                if ( matches ) {
                    visible++;
                    if ( term ) {
                        preguntaEl.innerHTML  = highlight( preguntaEl.dataset.original, rawTerm );
                        respuestaEl.innerHTML = highlight( respuestaEl.dataset.original, rawTerm );
                    } else {
                        // Restaurar HTML original
                        preguntaEl.innerHTML  = preguntaEl.dataset.original;
                        respuestaEl.innerHTML = respuestaEl.dataset.original;
                    }
                }
            } );

            if ( noResults ) {
                noResults.hidden = ( visible > 0 );
            }
        }

        // Debounce de 220ms para no disparar en cada tecla
        searchInput.addEventListener( 'input', function () {
            clearTimeout( searchTimeout );
            searchTimeout = setTimeout( performSearch, 220 );
        } );

        // Limpiar con el botón X
        if ( clearBtn ) {
            clearBtn.addEventListener( 'click', function () {
                searchInput.value = '';
                performSearch();
                searchInput.focus();
            } );
        }
    }

    /* ---- Inicializar todas las instancias del bloque ----------- */

    function init() {
        const wrappers = document.querySelectorAll( '.fib-wrapper' );
        wrappers.forEach( initFAQ );
    }

    // DOMContentLoaded o inmediato si ya cargó
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }

} )();