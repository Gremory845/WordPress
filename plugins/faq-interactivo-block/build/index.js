/**
 * FAQ Interactivo Block — Gutenberg Editor Script
 */

( function ( blocks, element, blockEditor, components, i18n ) {
    'use strict';

    const { registerBlockType } = blocks;
    const { createElement: el, useState, Fragment } = element;
    const { InspectorControls, useBlockProps, PanelColorSettings } = blockEditor;
    const { PanelBody, PanelRow, TextControl, TextareaControl, ToggleControl, SelectControl, Button, Notice,
        __experimentalDivider: Divider } = components;
    const { __ } = i18n;

    /* ---- Icono del bloque ---- */
    const blockIcon = el(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        el( 'rect', { x: 3, y: 3, width: 18, height: 5, rx: 2 } ),
        el( 'rect', { x: 3, y: 10, width: 18, height: 5, rx: 2 } ),
        el( 'rect', { x: 3, y: 17, width: 18, height: 5, rx: 2 } )
    );

    /* ---- Función auxiliar para generar IDs únicos ---- */
    function genId() {
        return 'faq-' + Math.random().toString( 36 ).slice( 2, 8 );
    }

    /* ================================================================
       Componente de edición
    ================================================================ */
    function Edit( { attributes, setAttributes } ) {
        const {
            titulo, subtitulo,
            colorAcento, colorFondo, colorTexto,
            mostrarBusqueda, animacionIcono,
            items,
        } = attributes;

        const blockProps = useBlockProps( {
            style: {
                '--fib-acento' : colorAcento,
                '--fib-fondo'  : colorFondo,
                '--fib-texto'  : colorTexto,
            },
        } );

        /* ---- Handlers de ítems FAQ ---- */
        function updateItem( index, field, value ) {
            const updated = items.map( ( item, i ) =>
                i === index ? { ...item, [field]: value } : item
            );
            setAttributes( { items: updated } );
        }

        function addItem() {
            setAttributes( {
                items: [
                    ...items,
                    { id: genId(), pregunta: '', respuesta: '' },
                ],
            } );
        }

        function removeItem( index ) {
            setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
        }

        function moveItem( index, direction ) {
            const newItems = [ ...items ];
            const target   = index + direction;
            if ( target < 0 || target >= newItems.length ) return;
            [ newItems[ index ], newItems[ target ] ] = [ newItems[ target ], newItems[ index ] ];
            setAttributes( { items: newItems } );
        }

        /* ---- Estado local: qué ítem está expandido en el editor ---- */
        const [ openIndex, setOpenIndex ] = useState( null );

        function toggleEditorItem( index ) {
            setOpenIndex( openIndex === index ? null : index );
        }

        /* ---- Panel lateral (Inspector Controls) ---- */
        const inspector = el(
            InspectorControls,
            null,

            /* Panel: Contenido general */
            el( PanelBody, { title: __( 'Contenido', 'faq-interactivo-block' ), initialOpen: true },
                el( TextControl, {
                    label   : __( 'Título', 'faq-interactivo-block' ),
                    value   : titulo,
                    onChange: ( v ) => setAttributes( { titulo: v } ),
                } ),
                el( TextControl, {
                    label   : __( 'Subtítulo', 'faq-interactivo-block' ),
                    value   : subtitulo,
                    onChange: ( v ) => setAttributes( { subtitulo: v } ),
                } ),
            ),

            /* Panel: Apariencia */
            el( PanelBody, { title: __( 'Apariencia', 'faq-interactivo-block' ), initialOpen: false },
                el( SelectControl, {
                    label   : __( 'Animación del ícono', 'faq-interactivo-block' ),
                    value   : animacionIcono,
                    options : [
                        { label: __( 'Chevron (gira)', 'faq-interactivo-block' ), value: 'rotate' },
                        { label: __( 'Plus / Minus', 'faq-interactivo-block' ),  value: 'plus'   },
                    ],
                    onChange: ( v ) => setAttributes( { animacionIcono: v } ),
                } ),
                el( ToggleControl, {
                    label   : __( 'Mostrar buscador', 'faq-interactivo-block' ),
                    checked : mostrarBusqueda,
                    onChange: ( v ) => setAttributes( { mostrarBusqueda: v } ),
                } ),
            ),

            /* Panel: Colores */
            el( PanelColorSettings, {
                title          : __( 'Colores', 'faq-interactivo-block' ),
                initialOpen    : false,
                colorSettings  : [
                    {
                        label   : __( 'Color de acento', 'faq-interactivo-block' ),
                        value   : colorAcento,
                        onChange: ( v ) => setAttributes( { colorAcento: v || '#7c3aed' } ),
                    },
                    {
                        label   : __( 'Color de fondo de ítem', 'faq-interactivo-block' ),
                        value   : colorFondo,
                        onChange: ( v ) => setAttributes( { colorFondo: v || '#1e293b' } ),
                    },
                    {
                        label   : __( 'Color de texto', 'faq-interactivo-block' ),
                        value   : colorTexto,
                        onChange: ( v ) => setAttributes( { colorTexto: v || '#f8fafc' } ),
                    },
                ],
            } ),

            /* Panel: Gestión de preguntas */
            el( PanelBody, { title: __( 'Preguntas FAQ', 'faq-interactivo-block' ), initialOpen: true },
                items.map( ( item, index ) =>
                    el( 'div', {
                            key      : item.id,
                            style    : {
                                border       : '1px solid rgba(124,58,237,0.3)',
                                borderRadius : '8px',
                                padding      : '12px',
                                marginBottom : '12px',
                                background   : 'rgba(124,58,237,0.05)',
                            },
                        },
                        el( 'div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                            el( 'strong', { style: { fontSize: '0.85rem', opacity: 0.7 } },
                                __( 'Pregunta', 'faq-interactivo-block' ) + ' ' + ( index + 1 )
                            ),
                            el( 'div', { style: { display: 'flex', gap: '4px' } },
                                el( Button, {
                                    isSmall   : true,
                                    variant   : 'tertiary',
                                    disabled  : index === 0,
                                    onClick   : () => moveItem( index, -1 ),
                                    title     : __( 'Subir', 'faq-interactivo-block' ),
                                }, '↑' ),
                                el( Button, {
                                    isSmall   : true,
                                    variant   : 'tertiary',
                                    disabled  : index === items.length - 1,
                                    onClick   : () => moveItem( index, 1 ),
                                    title     : __( 'Bajar', 'faq-interactivo-block' ),
                                }, '↓' ),
                                el( Button, {
                                    isSmall     : true,
                                    isDestructive: true,
                                    variant     : 'tertiary',
                                    onClick     : () => removeItem( index ),
                                    title       : __( 'Eliminar', 'faq-interactivo-block' ),
                                }, '✕' ),
                            ),
                        ),
                        el( TextControl, {
                            label       : __( 'Pregunta', 'faq-interactivo-block' ),
                            value       : item.pregunta,
                            onChange    : ( v ) => updateItem( index, 'pregunta', v ),
                            placeholder : __( 'Ej: ¿Qué incluye el servicio?', 'faq-interactivo-block' ),
                        } ),
                        el( TextareaControl, {
                            label       : __( 'Respuesta', 'faq-interactivo-block' ),
                            value       : item.respuesta,
                            onChange    : ( v ) => updateItem( index, 'respuesta', v ),
                            placeholder : __( 'Escribí la respuesta aquí…', 'faq-interactivo-block' ),
                            rows        : 3,
                        } ),
                    )
                ),
                el( Button, {
                    variant : 'primary',
                    onClick : addItem,
                    style   : { width: '100%', justifyContent: 'center', marginTop: '8px' },
                }, __( '+ Agregar pregunta', 'faq-interactivo-block' ) ),
            ),
        );

        /* ---- Preview en el editor ---- */
        const preview = el(
            'div',
            { ...blockProps, className: 'fib-wrapper fib-editor-preview' },

            el( 'p', { className: 'fib-editor-notice' },
                __( '⚙ Vista previa del editor — la interacción está activa en el frontend', 'faq-interactivo-block' )
            ),

            /* Header */
            el( 'div', { className: 'fib-header' },
                el( 'h2', { className: 'fib-titulo' }, titulo ),
                subtitulo && el( 'p', { className: 'fib-subtitulo' }, subtitulo ),
                mostrarBusqueda && el( 'div', { className: 'fib-search-wrap' },
                    el( 'span', { className: 'fib-search-icon' },
                        el( 'svg', { xmlns: 'http://www.w3.org/2000/svg', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' },
                            el( 'circle', { cx: 11, cy: 11, r: 8 } ),
                            el( 'line', { x1: 21, y1: 21, x2: 16.65, y2: 16.65 } )
                        )
                    ),
                    el( 'input', {
                        type        : 'text',
                        className   : 'fib-search',
                        placeholder : __( 'Buscar pregunta…', 'faq-interactivo-block' ),
                        readOnly    : true,
                    } )
                ),
            ),

            /* Lista acordeón (preview) */
            el( 'div', { className: 'fib-accordion' },
                items.map( ( item, index ) =>
                    el( 'div', {
                            key      : item.id,
                            className: 'fib-item' + ( openIndex === index ? ' fib-open' : '' ),
                        },
                        el( 'button', {
                                className  : 'fib-trigger',
                                type       : 'button',
                                onClick    : () => toggleEditorItem( index ),
                                'aria-expanded': String( openIndex === index ),
                            },
                            el( 'span', { className: 'fib-pregunta-text' }, item.pregunta || __( '(sin pregunta)', 'faq-interactivo-block' ) ),
                            el( 'span', { className: 'fib-icon' },
                                animacionIcono === 'plus'
                                    ? el( 'svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' },
                                        el( 'line', { x1: 12, y1: 5, x2: 12, y2: 19 } ),
                                        el( 'line', { x1: 5, y1: 12, x2: 19, y2: 12 } )
                                    )
                                    : el( 'svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
                                        el( 'polyline', { points: '6 9 12 15 18 9' } )
                                    )
                            ),
                        ),
                        openIndex === index && el( 'div', {
                                className: 'fib-panel',
                                style    : { maxHeight: 'none', display: 'block' },
                            },
                            el( 'div', { className: 'fib-respuesta' }, item.respuesta || __( '(sin respuesta)', 'faq-interactivo-block' ) )
                        ),
                    )
                )
            ),
        );

        return el( Fragment, null, inspector, preview );
    }

    /* ================================================================
       Registro del bloque
    ================================================================ */
    registerBlockType( 'fib/faq-interactivo', {
        title      : __( 'FAQ Interactivo', 'faq-interactivo-block' ),
        description: __( 'Acordeón de preguntas frecuentes con buscador en tiempo real y animaciones personalizables.', 'faq-interactivo-block' ),
        category   : 'design',
        icon       : blockIcon,
        keywords   : [ 'faq', 'acordeón', 'accordion', 'preguntas', 'interactivo' ],
        supports   : {
            html    : false,
            align   : [ 'wide', 'full' ],
            spacing : { margin: true, padding: true },
        },
        attributes : {
            titulo          : { type: 'string',  default: 'Preguntas Frecuentes' },
            subtitulo       : { type: 'string',  default: 'Todo lo que necesitás saber' },
            colorAcento     : { type: 'string',  default: '#7c3aed' },
            colorFondo      : { type: 'string',  default: '#1e293b' },
            colorTexto      : { type: 'string',  default: '#f8fafc' },
            mostrarBusqueda : { type: 'boolean', default: true },
            animacionIcono  : { type: 'string',  default: 'rotate' },
            items           : {
                type   : 'array',
                default: [
                    { id: 'faq-a', pregunta: '¿Qué servicios ofrecemos?',            respuesta: 'Ofrecemos desarrollo web, diseño UI/UX y consultoría tecnológica para empresas de todos los tamaños.' },
                    { id: 'faq-b', pregunta: '¿Cuál es el tiempo de entrega promedio?', respuesta: 'Dependiendo de la complejidad del proyecto, nuestros tiempos oscilan entre 2 y 8 semanas con entregas iterativas.' },
                    { id: 'faq-c', pregunta: '¿Ofrecen soporte post-lanzamiento?',   respuesta: 'Sí, contamos con planes de mantenimiento mensual que incluyen actualizaciones de seguridad y soporte técnico.' },
                ],
            },
        },
        edit: Edit,
        save: function () {
            // El HTML lo genera PHP (render_callback), el bloque es dinámico
            return null;
        },
    } );

} )(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n
);