const URL = "https://api.thedogapi.com/v1/breeds";
const axios = require("axios");
const formatDog = require("../utils/formatDog");

const getDogs = async (req, res) => {
	try {
		//Petición a la API
		const response = await axios.get(URL);
		//Datos de la respuesta
		const data = response.data;

		//Mapear los datos para limpiar la respuesta
		const dogs = data.map((dog) => formatDog(dog));

		//Enviar respuesta con el arreglo de perros
		res.status(200).json(dogs);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al obtener los perros" });
	}
};

module.exports = { getDogs };
