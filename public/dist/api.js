const URL_CATALOGO = './products.json';
//Cargar el catalogo de los productos
export async function cargaCatalogo() {
    const response = await fetch(URL_CATALOGO);
    if (!response.ok)
        throw new Error('Error al cargar el catálogo de productos');
    return response.json();
}
