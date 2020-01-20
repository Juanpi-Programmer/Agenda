<div class="campos">
    <div class="campo">
        <label for="nombre">Nombre:</label>
        <input 
            type="text" 
            placeholder="Nombre Contacto" 
            id="nombre"
            value="<?php if(isset($contacto['nombre']))echo ($contacto['nombre']) ? $contacto['nombre'] : ' ';?>"
        >
    </div>
    <div class="campo">
        <label for="empresa">Empresa:</label>
        <input 
            type="text" 
            placeholder="Nombre Empresa" 
            id="empresa"
            value="<?php if(isset($contacto['empresa']))echo ($contacto['empresa']) ? $contacto['empresa'] : ' ';?>"    
        >
    </div>
    <div class="campo">
        <label for="telefono">Teléfono:</label>
        <input 
            type="tel" 
            placeholder="Teléfono Contacto" 
            id="telefono"
            value="<?php if(isset($contacto['telefono']))echo ($contacto['telefono']) ? $contacto['telefono'] : ' ';?>"
        >
    </div>
</div>

<div class="campo enviar">
    <?php
        $textoBtn = (isset($contacto['telefono'])) ? 'Guardar' : 'Añadir';
        $accion = (isset($contacto['telefono'])) ? 'editar' : 'crear';
    ?>

    <input type="hidden" id="accion" value="<?php echo $accion; ?> ">

    <?php if(isset($contacto['id_contactos'] )) :?>
        <input 
            type="hidden" 
            id="id" 
            value="<?php echo $contacto['id_contactos'];?>"
        >
    <?php endif;?>
    
        <input type="submit" value="<?php echo $textoBtn; ?>">
</div>