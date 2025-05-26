import { Navigate ,Outlet} from "react-router-dom";
export function Rutas_privdas(){

    let auth = false;


    return(

        auth ? <Outlet />:<Navigate to = "/" />

    )
}
export default Rutas_privdas