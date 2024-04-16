const listOfShapeFilesURL =
  'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin/getProvisionedShapefiles.py';
const giovanniAPI = 'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin';

const getShapeFiles = async () => {
  const response = await fetch(`${giovanniAPI}/getProvisionedShapefiles.py`, {
    method: 'GET',
    redirect: 'follow',
  });

  console.log(await response.json());

  return await response.json();
};

const geojsonAPI =
  'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin/getGeoJSON.py?shape=state_dept_countries_2017/shp_251';

const getGEOJSON = async (params: {category: string; shape: string}) => {
  const response = await fetch(
    `${giovanniAPI}/getGeoJSON.py?shape=${params.category}/${params.shape}`,
    {}
  );
};

export {getGEOJSON, getShapeFiles};
