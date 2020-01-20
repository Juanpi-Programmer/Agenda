<?php 
    if (isset($_POST['accion'])) {
        if($_POST['accion'] == 'crear '){
            //creará un nuevo registro en la bd
    
            require_once('../funciones/db.php');
    
            //VALIDAR LAS ENTRADAS
            $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
            $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
            $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
            
            try{
                $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
                //3 string
                $stmt->bind_param("sss", $nombre, $empresa, $telefono);
    
                $stmt->execute();
                if ($stmt->affected_rows == 1) {
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'datos' => array(
                            'nombre' => $nombre,
                            'empresa' => $empresa,
                            'telefono' => $telefono,
                            'id_insertado' => $stmt->insert_id
                        )
                    );
                }
                $stmt->close();
                $conn->close();
            }catch(Exception $e){
                $respuesta = array(
                    'error' => $e->getMessage()
                );
            }
    
            echo json_encode($respuesta);
        }
    }

    if(isset($_GET['accion'])){
        if ($_GET['accion'] == 'borrar') {
            require_once('../funciones/db.php');

            $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

            try{
                $stmt = $conn->prepare("DELETE FROM contactos WHERE id_contactos = ? ");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                if($stmt->affected_rows == 1){
                    $respuesta = array(
                        'respuesta' => 'correcto'
                    );
                }
                $stmt->close();
                $conn->close();
            } catch (Exception $e){
                $respuesta = array(
                    'error' => $e->getMessage()
                );
            }
            echo json_encode($respuesta);
        }
        
    }

    if(isset($_POST['accion'])){
        if ($_POST['accion'] == 'editar ') {
            require_once('../funciones/db.php');

             //VALIDAR LAS ENTRADAS
             $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
             $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
             $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
             $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

             try{
                $stmt = $conn->prepare("UPDATE contactos SET nombre = ? , empresa = ?, telefono = ? WHERE id_contactos = ?");
                $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id);
                $stmt->execute();
                if ($stmt->affected_rows == 1) {
                    $respuesta = array(
                        'respuesta' => 'correcto'
                    );
                }else{
                    $respuesta = array (
                        'respuesta' => 'error'
                    );
                }
                $stmt->close();
                $conn->close();
            }catch(Exception $e){
                $respuesta = array(
                    'error' => $e->getMessage()
                );
            }
            echo json_encode($respuesta);
        }   
    }

