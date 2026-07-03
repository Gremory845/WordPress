<?php
/**
 * Plugin Name: Tech Stack Recommender
 * Description: Recomendador interactivo de tecnologías para proyectos digitales.
 * Version: 1.0
 * Author: Jose Zamora
 * License: GPL2
 */

defined('ABSPATH') || exit;

define('TSR_PLUGIN_URL', plugin_dir_url(__FILE__));

function tsr_enqueue_assets() {

    wp_enqueue_style(
        'tsr-style',
        TSR_PLUGIN_URL . 'css/style.css',
        array(),
        '1.0'
    );

    wp_enqueue_script(
        'tsr-script',
        TSR_PLUGIN_URL . 'js/script.js',
        array(),
        '1.0',
        true
    );

}

function tsr_shortcode() {

    tsr_enqueue_assets();

    ob_start();
    ?>

    <section id="tech-stack-recommender">

        <div class="tsr-header">
            <span class="tsr-badge">Asesor tecnológico</span>

            <h2>Recomendador de Tecnologías</h2>

            <p>
                Responda unas preguntas básicas sobre su proyecto y obtenga una recomendación inicial
                de tecnologías para desarrollar una solución digital moderna y escalable.
            </p>
        </div>

        <div class="tsr-wrapper">

            <form class="tsr-form">

                <label>
                    ¿Qué desea desarrollar?
                    <select id="tsr-project-type">
                        <option value="website">Sitio web empresarial</option>
                        <option value="ecommerce">Tienda en línea</option>
                        <option value="system">Sistema web a medida</option>
                        <option value="mobile">Aplicación móvil</option>
                    </select>
                </label>

                <label>
                    Tamaño estimado del proyecto
                    <select id="tsr-size">
                        <option value="small">Pequeño</option>
                        <option value="medium">Mediano</option>
                        <option value="large">Grande</option>
                    </select>
                </label>

                <label>
                    Nivel de interacción requerido
                    <select id="tsr-interaction">
                        <option value="basic">Básico</option>
                        <option value="dynamic">Dinámico</option>
                        <option value="advanced">Avanzado</option>
                    </select>
                </label>

                <label>
                    Prioridad principal del proyecto
                    <select id="tsr-priority">
                        <option value="speed">Rapidez de desarrollo</option>
                        <option value="scalability">Escalabilidad</option>
                        <option value="design">Diseño e interfaz visual</option>
                        <option value="security">Seguridad</option>
                    </select>
                </label>

            </form>

            <div class="tsr-result">

                <h3>Recomendación Inicial</h3>

                <div class="tsr-complexity" id="tsr-complexity">
                    Proyecto Básico
                </div>

                <div class="tsr-stack-grid">

                    <div class="tsr-stack-card">
                        <span>Frontend</span>
                        <strong id="tsr-frontend">HTML, CSS y JavaScript</strong>
                    </div>

                    <div class="tsr-stack-card">
                        <span>Backend</span>
                        <strong id="tsr-backend">WordPress</strong>
                    </div>

                    <div class="tsr-stack-card">
                        <span>Base de datos</span>
                        <strong id="tsr-database">MySQL</strong>
                    </div>

                    <div class="tsr-stack-card">
                        <span>Hosting</span>
                        <strong id="tsr-hosting">Hosting compartido</strong>
                    </div>

                </div>

                <p class="tsr-time">
                    Tiempo aproximado:
                    <strong id="tsr-time">1 - 2 semanas</strong>
                </p>

                <p class="tsr-note">
                    Esta recomendación es una guía inicial. Para definir una arquitectura técnica completa,
                    es necesario analizar los objetivos, presupuesto, funcionalidades y crecimiento esperado del proyecto.
                </p>

            </div>

        </div>

    </section>

    <?php
    return ob_get_clean();

}

add_shortcode('tech_stack_recommender', 'tsr_shortcode');