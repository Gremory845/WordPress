<?php
/**
 * Plugin Name: Tech Quote Calculator
 * Description: Calculadora de cotización general para servicios tecnológicos y desarrollo web.
 * Version: 1.0
 * Author: Jose Zamora
 * License: GPL2
 */

defined('ABSPATH') || exit;

define('TQC_PLUGIN_URL', plugin_dir_url(__FILE__));

function tqc_enqueue_assets() {

    wp_enqueue_style(
        'tqc-style',
        TQC_PLUGIN_URL . 'css/style.css',
        array(),
        '1.0'
    );

    wp_enqueue_script(
        'tqc-script',
        TQC_PLUGIN_URL . 'js/script.js',
        array(),
        '1.0',
        true
    );

}

function tqc_shortcode() {

    tqc_enqueue_assets();

    ob_start();
    ?>

    <section id="tech-quote-calculator">

        <div class="tqc-header">
            <span class="tqc-badge">Cotización rápida</span>
            <h2>Calculadora de Servicios Tecnológicos</h2>
            <p>
                Obtenga una estimación general para su proyecto web.
                Para una cotización personalizada, le recomendamos contactar directamente con nuestro equipo.
            </p>
        </div>

        <div class="tqc-wrapper">

            <form class="tqc-form">

                <label>
                    Tipo de proyecto
                    <select id="tqc-project">
                        <option value="250">Landing Page</option>
                        <option value="500">Sitio Web Corporativo</option>
                        <option value="950">Tienda en Línea</option>
                        <option value="1400">Sistema Web Personalizado</option>
                    </select>
                </label>

                <label>
                    Cantidad de páginas o secciones
                    <select id="tqc-pages">
                        <option value="100">1 - 3 páginas</option>
                        <option value="250">4 - 6 páginas</option>
                        <option value="450">7 - 10 páginas</option>
                        <option value="700">Más de 10 páginas</option>
                    </select>
                </label>

                <label>
                    Nivel de diseño UI
                    <select id="tqc-design">
                        <option value="100">Básico</option>
                        <option value="250">Moderno</option>
                        <option value="450">Premium personalizado</option>
                    </select>
                </label>

                <div class="tqc-extras">
                    <p>Funcionalidades adicionales</p>

                    <label>
                        <input type="checkbox" value="80">
                        Formulario de contacto
                    </label>

                    <label>
                        <input type="checkbox" value="60">
                        Integración con WhatsApp
                    </label>

                    <label>
                        <input type="checkbox" value="350">
                        Panel administrativo
                    </label>

                    <label>
                        <input type="checkbox" value="150">
                        Optimización SEO básica
                    </label>

                    <label>
                        <input type="checkbox" value="180">
                        Animaciones e interacciones
                    </label>
                </div>

            </form>

            <div class="tqc-result">

                <h3>Cotización General</h3>

                <div class="tqc-price">
                    $<span id="tqc-total">0</span> USD
                </div>

                <div class="tqc-time">
                    Tiempo estimado:
                    <strong><span id="tqc-weeks">1 - 2</span> semanas</strong>
                </div>

                <p class="tqc-note">
                    Esta cotización es únicamente una estimación general basada en los datos seleccionados.
                    El costo final puede variar según los requerimientos específicos del proyecto.
                    Para recibir una propuesta personalizada y ajustada a sus necesidades, le invitamos a contactarnos.
                </p>

                <button type="button" class="tqc-contact">
                    Solicitar cotización personalizada
                </button>

            </div>

        </div>

        <div id="tqc-modal" class="tqc-modal">

            <div class="tqc-modal-content">

                <button type="button" class="tqc-close-modal">
                    ×
                </button>

                <div id="tqc-pdf-content">

                    <h2>Cotización General</h2>

                    <p>
                        <strong>Tipo de proyecto:</strong>
                        <span id="tqc-summary-project"></span>
                    </p>

                    <p>
                        <strong>Cantidad de páginas o secciones:</strong>
                        <span id="tqc-summary-pages"></span>
                    </p>

                    <p>
                        <strong>Nivel de diseño:</strong>
                        <span id="tqc-summary-design"></span>
                    </p>

                    <p>
                        <strong>Funcionalidades adicionales:</strong>
                        <span id="tqc-summary-extras"></span>
                    </p>

                    <p>
                        <strong>Costo estimado:</strong>
                        $<span id="tqc-summary-total"></span> USD
                    </p>

                    <p>
                        <strong>Tiempo estimado:</strong>
                        <span id="tqc-summary-weeks"></span> semanas
                    </p>

                    <p class="tqc-summary-note">
                        Esta cotización es únicamente una estimación general.
                        Para obtener una propuesta personalizada y ajustada a las necesidades específicas del proyecto,
                        se recomienda contactar directamente con el equipo.
                    </p>

                </div>

                <button type="button" id="tqc-download-pdf" class="tqc-download-pdf">
                    Descargar como PDF
                </button>

            </div>

        </div>

    </section>

    <?php
    return ob_get_clean();

}

add_shortcode('tech_quote_calculator', 'tqc_shortcode');