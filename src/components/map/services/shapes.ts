const getShapeFiles = async () => {
    const data = await fetch('http://localhost:9000/getProvisionedShapefiles', {
        mode: 'cors',
    })

    const listOfShapes = await data.json()

    return listOfShapes
}

const fetchSelectedShape = async (query: any) => {
    const url = new URL('http://localhost:9000/getGeoJSON')

    // Assuming the query is formatted as 'key=value'
    const [key, value] = query.split('=')
    if (key && value) {
        url.searchParams.append(key, encodeURIComponent(value))
    }

    const data = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
    })

    const shape = await data.json()

    return shape
}

export { fetchSelectedShape, getShapeFiles }
