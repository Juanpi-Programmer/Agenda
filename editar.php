<?php 
    include 'inc/layout/header.php';
    include 'inc/funciones/funciones.php';


    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

    if (!$id) {
        die('No es valido');
    }

    $resultado = obtenerContacto($id);
    $contacto = $resultado->fetch_assoc();

?>
<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar Contactos</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
    <form action="#" id="contacto">
        <legend>
            Editar el contacto
        </legend>

        <?php include 'inc/layout/formulario.php';?>
    </form>
</div><!--Cierra bg-amarillo contenedor sombra-->


<?php include 'inc/layout/footer.php' ?>