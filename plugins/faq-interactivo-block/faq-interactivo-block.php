<?php
/**
 * Plugin Name: FAQ Interactivo Block
 * Description: Bloque de Gutenberg personalizado que renderiza un FAQ interactivo con animaciones.
 * Version: 1.0.0
 * Author: Joshua Herrera
 * Text Domain: faq-interactivo-block
 */

// Seguridad: impedir acceso directo al archivo
defined( 'ABSPATH' ) || exit;

// Constantes del plugin
define( 'FIB_VERSION', '1.0.0' );
define( 'FIB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FIB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registra el bloque de Gutenberg y sus assets asociados.
 * Se ejecuta en el hook 'init' para garantizar compatibilidad con WP.
 */
function fib_register_block() {
    // Registrar el script del editor (build generado por @wordpress/scripts)
    wp_register_script(
        'fib-editor-script',
        FIB_PLUGIN_URL . 'build/index.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-block-editor' ),
        FIB_VERSION,
        true
    );

    // Registrar el estilo del editor (vista dentro de Gutenberg)
    wp_register_style(
        'fib-editor-style',
        FIB_PLUGIN_URL . 'assets/css/editor.css',
        array( 'wp-edit-blocks' ),
        FIB_VERSION
    );

    // Registrar el estilo del frontend (lo que ve el visitante)
    wp_register_style(
        'fib-frontend-style',
        FIB_PLUGIN_URL . 'assets/css/frontend.css',
        array(),
        FIB_VERSION
    );

    // Registrar el script del frontend (interactividad del acordeón)
    wp_register_script(
        'fib-frontend-script',
        FIB_PLUGIN_URL . 'assets/js/frontend.js',
        array(),
        FIB_VERSION,
        true   // Cargar en el footer para no bloquear el render
    );

    // Registrar y vincular el bloque con sus assets
    register_block_type( 'fib/faq-interactivo', array(
        'editor_script' => 'fib-editor-script',
        'editor_style' => 'fib-editor-style',
        'style' => 'fib-frontend-style',
        'script' => 'fib-frontend-script',
        'render_callback' => 'fib_render_block',
        'attributes' => array(
            'titulo' => array(
                'type' => 'string',
                'default' => 'Preguntas Frecuentes',
            ),
            'subtitulo' => array(
                'type' => 'string',
                'default' => 'Todo lo que necesitás saber',
            ),
            'colorAcento' => array(
                'type' => 'string',
                'default' => '#7c3aed',
            ),
            'colorFondo' => array(
                'type' => 'string',
                'default' => '#1e293b',
            ),
            'colorTexto' => array(
                'type' => 'string',
                'default' => '#f8fafc',
            ),
            'mostrarBusqueda' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'animacionIcono' => array(
                'type' => 'string',
                'default' => 'rotate',
            ),
            'items' => array(
                'type' => 'array',
                'default' => array(
                    array(
                        'id' => 'faq-1',
                        'pregunta' => '¿Qué servicios ofrecemos?',
                        'respuesta' => 'Ofrecemos desarrollo web, diseño UI/UX y consultoría tecnológica para empresas.',
                    ),
                    array(
                        'id' => 'faq-2',
                        'pregunta' => '¿Cuál es el tiempo de entrega promedio?',
                        'respuesta' => 'Dependiendo de la complejidad del proyecto, nuestros tiempos oscilan entre 2 y 8 semanas, con entregas parciales iterativas.',
                    ),
                    array(
                        'id' => 'faq-3',
                        'pregunta' => '¿Ofrecen soporte post-lanzamiento?',
                        'respuesta' => 'Sí, contamos con planes de mantenimiento mensual que incluyen actualizaciones de seguridad, mejoras de rendimiento y soporte técnico.',
                    ),
                ),
                'items' => array(
                    'type' => 'object',
                    'properties' => array(
                        'id' => array( 'type' => 'string' ),
                        'pregunta' => array( 'type' => 'string' ),
                        'respuesta'=> array( 'type' => 'string' ),
                    ),
                ),
            ),
        ),
    ) );
}
add_action( 'init', 'fib_register_block' );

/**
 * Render callback del bloque en el frontend.
 * Genera el HTML dinámico a partir de los atributos guardados.
 *
 * @param array $atts Atributos del bloque.
 * @return string HTML del componente.
 */
function fib_render_block( $atts ) {
    $titulo = esc_html( $atts['titulo'] ?? 'Preguntas Frecuentes' );
    $subtitulo = esc_html( $atts['subtitulo'] ?? '' );
    $color_acento = sanitize_hex_color( $atts['colorAcento'] ?? '#7c3aed' );
    $color_fondo = sanitize_hex_color( $atts['colorFondo'] ?? '#1e293b' );
    $color_texto = sanitize_hex_color( $atts['colorTexto'] ?? '#f8fafc' );
    $mostrar_busqueda = ! empty( $atts['mostrarBusqueda'] );
    $animacion_icono = in_array( $atts['animacionIcono'] ?? 'rotate', array( 'rotate', 'plus' ), true )
        ? $atts['animacionIcono']
        : 'rotate';
    $items = $atts['items'] ?? array();

    // Generar un ID único por instancia del bloque (soporta múltiples bloques en la misma página)
    $block_id = 'fib-' . wp_unique_id();

    ob_start();
    ?>
    <div
        id="<?php echo esc_attr( $block_id ); ?>"
        class="fib-wrapper"
        data-animacion="<?php echo esc_attr( $animacion_icono ); ?>"
        style="
            --fib-acento: <?php echo esc_attr( $color_acento ); ?>;
            --fib-fondo: <?php echo esc_attr( $color_fondo ); ?>;
            --fib-texto: <?php echo esc_attr( $color_texto ); ?>;
        "
    >
        <!-- Encabezado del bloque -->
        <div class="fib-header">
            <h2 class="fib-titulo"><?php echo $titulo; ?></h2>
            <?php if ( $subtitulo ) : ?>
                <p class="fib-subtitulo"><?php echo $subtitulo; ?></p>
            <?php endif; ?>

            <?php if ( $mostrar_busqueda ) : ?>
                <!-- Buscador en tiempo real (interacción requerida) -->
                <div class="fib-search-wrap">
                    <span class="fib-search-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input
                        type="text"
                        class="fib-search"
                        placeholder="Buscar pregunta…"
                        aria-label="Buscar en las preguntas frecuentes"
                    />
                    <button class="fib-search-clear" aria-label="Limpiar búsqueda" hidden>&#x2715;</button>
                </div>
            <?php endif; ?>
        </div>

        <!-- Lista del acordeón -->
        <div class="fib-accordion" role="list">
            <?php if ( empty( $items ) ) : ?>
                <p class="fib-empty">No hay preguntas configuradas aún.</p>
            <?php else : ?>
                <?php foreach ( $items as $index => $item ) :
                    $item_id = esc_attr( $item['id'] ?? 'faq-' . $index );
                    $pregunta = esc_html( $item['pregunta'] ?? '' );
                    $respuesta = wp_kses_post( $item['respuesta'] ?? '' );
                    $panel_id = $block_id . '-panel-' . $index;
                    $btn_id = $block_id . '-btn-'   . $index;
                ?>
                <div
                    class="fib-item"
                    data-item-id="<?php echo $item_id; ?>"
                    role="listitem"
                >
                    <button
                        id="<?php echo $btn_id; ?>"
                        class="fib-trigger"
                        aria-expanded="false"
                        aria-controls="<?php echo $panel_id; ?>"
                        type="button"
                    >
                        <span class="fib-pregunta-text"><?php echo $pregunta; ?></span>
                        <span class="fib-icon" aria-hidden="true">
                            <?php if ( $animacion_icono === 'plus' ) : ?>
                                <svg class="fib-icon-plus" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            <?php else : ?>
                                <svg class="fib-icon-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            <?php endif; ?>
                        </span>
                    </button>
                    <div
                        id="<?php echo $panel_id; ?>"
                        class="fib-panel"
                        role="region"
                        aria-labelledby="<?php echo $btn_id; ?>"
                        hidden
                    >
                        <div class="fib-respuesta">
                            <?php echo $respuesta; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- Mensaje cuando la búsqueda no arroja resultados -->
        <p class="fib-no-results" hidden>No se encontraron preguntas para esa búsqueda.</p>
    </div>
    <?php
    return ob_get_clean();
}