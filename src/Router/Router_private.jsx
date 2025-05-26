import { Navigate ,Outlet} from "react-router-dom";
export function rutas_privdas(){

    let auth = false;


    return(

        auth ? <Outlet />:<Navigate to = "/Juego"/>

    )
}