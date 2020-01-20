const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');
eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
    //Listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }
    inputBuscador.addEventListener('input', buscarContactos);
    numeroContactos();
}

function leerFormulario(e) {
    e.preventDefault();

    //Leer datos de los input
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;
    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros: texto clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    }else{
        //Pasa la validacion, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto);
        
        if (accion== 'crear ') {
            //crearemos un nuevo contacto
            insertarBD(infoContacto);
        }else{
            //editar el contacto
            //Leer el ID 
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

/** Inserta en la base de datos via AJAX **/
function insertarBD(datos) {
    //llamado a ajax

    //crear el objeto
    const xhr = new XMLHttpRequest();
    //abrir la conexcion
    xhr.open('POST', 'inc/modelos/modelos-contacto.php', true);
    //pasar los datos
    xhr.onload = function () {
        if(this.status === 200){
            //leemos respuesta de php
            const respuesta = JSON.parse(xhr.responseText);  
            
            //Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;
            //Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');
            //Crear el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');
            
            //Crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //Agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            //Crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('far', 'fa-trash-alt');

            //crear boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            //Agregarlo al TR
            nuevoContacto.appendChild(contenedorAcciones);

            //agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            //resetear el form
            document.querySelector('form').reset();
            //mostrar notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto')

            //aCTUALIZAMOS EL CONTADOR
            numeroContactos();

        }
    }
    //eviar los datos
    xhr.send(datos)

}

function actualizarRegistro(datos) {
    //crear el objeto
    const xhr = new XMLHttpRequest();
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-contacto.php', true);
    //leer la respuesta
    xhr.onload = function () {
        if(this.status === 200){
            const resultado = JSON.parse(xhr.responseText);  
            console.log(resultado);
            if(resultado.respuesta === 'correcto'){
                mostrarNotificacion("Contacto Editado Correctamente", "correcto");
            }else{
                mostrarNotificacion("Hubo un error...", "error");
            }
            
            //Despues de 3 segundos redireccionar
            setTimeout(() =>{
                window.location.href = 'index.php';
            }, 4000);
        }
    }
    //enviar la peticion
    xhr.send(datos);
}

//Eliminar el Contacto
function eliminarContacto(e) {
   if (e.target.parentElement.classList.contains('btn-borrar')) {
       //Tomar el id
       const id = e.target.parentElement.getAttribute('data-id');
    
        //preguntar al user
        const respuesta = confirm('¿Estas seguro (a) ?')
        if (respuesta) {
            //LLAMADO A AJAX
            //crear el objeto
            const xhr = new XMLHttpRequest();
            //abrir la conexion
            xhr.open('GET', `inc/modelos/modelos-contacto.php?id=${id}&accion=borrar `, true);

            //leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);  
                    console.log(resultado);
                    
                    if (resultado.respuesta == 'correcto') {
                        //Eliminar el registro del DOM
                        e.target.parentElement.parentElement.parentElement.remove()
                        //mostrar notificacion
                        mostrarNotificacion('Contacto Eliminado', 'correcto')
                        //aCTUALIZAMOS EL CONTADOR
                        numeroContactos();
                    }else{
                        //MOSTRAR notificacion
                        mostrarNotificacion('Upss... hubo un error', 'error')
                    }
                }
            }
            //enviar la peticion
            xhr.send();
        }  
   }
   
}
//Notificacion en Pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase,'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    //Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Ocultar y Mostrar la noti
    setTimeout(()=>{
        notificacion.classList.add('visible');

        setTimeout(()=>{
            notificacion.classList.remove('visible');
            setTimeout(()=>{
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}

/***Buscador de registros */
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
          registros = document.querySelectorAll('tbody tr');
    
    registros.forEach(registros => {
        registros.style.display = 'none';

        ///\s/g, " " BUSCA CON LOS ESPACIOS
        if (registros.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registros.style.display = 'table-row';
        }

        numeroContactos();
    })
}

function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');
    
    let total = 0;

    totalContactos.forEach(contacto =>{
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        } 
    });

    // console.log(total);
    contenedorNumero.textContent = total
    
    
    
}