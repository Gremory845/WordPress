<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Astra
 * @since 1.0.0
 */
?>
        </div> </div> <footer class="site-footer-custom">
        <div class="container footer-grid">
            <div class="footer-section">
                <h3 class="footer-title">Información Legal</h3>
                <ul class="legal-links">
                    <li><a href="#">Política de Privacidad</a></li>
                    <li><a href="#">Términos de Servicio</a></li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Síguenos</h3>
                <div class="social-networks">
                    <a href="https://www.facebook.com/joshua.hr.172345" target="_blank" class="social-icon"><i class="fab fa-facebook"></i></a>
                    <a href="https://www.instagram.com/joshua_hr27/" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> - Desarrollo Rápido de Aplicaciones</p>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>