export type messages = 'general_auth_error' |
    'forgotten_login_error' |
    'login_user_error' |
    'invalid_user_error' |
    'invalid_email_error' |
    'user_not_found_error';

export const NOTIFICATIONS: Record<messages, string> = {
    'general_auth_error': "Error al iniciar sesion. Por favor, intente mas tarde.",
    'forgotten_login_error': "Ha cerrado el servicio de autenticación. Por favor, inicie sesión como administrador del sistema.",
    'login_user_error': "No se ha posido iniciar sesion. Por favor, intente mas tarde.",
    'invalid_user_error': "El usuario no es administrador del sistema. Por favor, comuniquese con el dueño del sitio.",
    'invalid_email_error': "El correo electronico no pertenece a los dominios de la UTM.",
    'user_not_found_error': "El usuario no ha sido encontrado. Por favor, inicie sesion con cuentas activas de Google."
}

