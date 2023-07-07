const { Dog, Temperament } = require("../db");
const axios = require("axios");
const URL = "https://api.thedogapi.com/v1/breeds";
const formatDog = require("../utils/formatDog");
const { Op } = require("sequelize");

async function searchDogsByName(req, res) {
	const { name } = req.query;
	const formattedName = name.toLowerCase();
	try {
		// Buscar en la base de datos
		const dbDogs = await Dog.findAll({
			where: {
				name: {
					[Op.iLike]: `%${formattedName}%`,
				},
			},
			include: Temperament,
		});

		// Formatear perros de la base de datos
		const formattedDbDogs = dbDogs.map((dog) => formatDog(dog.toJSON()));

		// Consultar en la API externa
		const response = await axios.get(URL);
		const apiDogs = response.data;

		// Filtrar las razas de perros que contengan la palabra en el nombre
		const filteredApiDogs = apiDogs.filter((dog) =>
			dog.name.toLowerCase().includes(formattedName)
		);
		const formattedApiDogs = filteredApiDogs.map((dog) => formatDog(dog));

		// Combinar resultados de la base de datos y la API
		const dogs = [...formattedDbDogs, ...formattedApiDogs];

		if (dogs.length === 0) {
			return res.status(404).json({
				error: "No se encontraron razas de perros con ese nombre",
			});
		}

		res.status(200).json(dogs);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error al buscar las razas de perros por nombre",
		});
	}
}

module.exports = { searchDogsByName };
