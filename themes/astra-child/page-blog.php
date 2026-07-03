<?php
/**
 * Template Name: Blog Personalizado
 */
get_header();
?>

<div class="mi-blog-wrapper">
  <h1 class="mi-blog-titulo"></h1>

  <div class="mi-blog-grid">
    <?php
    $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

    $args = array(
      'post_type'      => 'post',
      'posts_per_page' => 9,
      'paged'          => $paged,
    );

    $blog_query = new WP_Query($args);

    if ($blog_query->have_posts()) :
      while ($blog_query->have_posts()) : $blog_query->the_post();
    ?>
      <article class="mi-blog-card">
        <a href="<?php the_permalink(); ?>" class="mi-blog-card-imagen">
          <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('medium_large'); ?>
          <?php endif; ?>
        </a>
        <div class="mi-blog-card-contenido">
          <span class="mi-blog-card-categoria"><?php echo get_the_category()[0]->name ?? ''; ?></span>
          <h2 class="mi-blog-card-titulo">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
          </h2>
          <p class="mi-blog-card-extracto"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
          <span class="mi-blog-card-fecha"><?php echo get_the_date(); ?></span>
        </div>
      </article>
    <?php
      endwhile;
    ?>

    <div class="mi-blog-paginacion">
      <?php
      echo paginate_links(array(
        'total'   => $blog_query->max_num_pages,
        'current' => $paged,
      ));
      ?>
    </div>

    <?php
    else :
      echo '<p>No hay entradas todavía.</p>';
    endif;

    wp_reset_postdata();
    ?>
  </div>
</div>

<?php get_footer(); ?>