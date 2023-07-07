const { Temperament } = require("../db");
const axios = require("axios");

async function getTemperaments(req, res) {
	try {
		// Verificar si los temperamentos ya existen en la base de datos
		const existingTemperaments = await Temperament.findAll();

		if (existingTemperaments.length > 0) {
			res.status(200).json(existingTemperaments);
		} else {
			// Obtener los temperamentos de la API
			const response = await axios.get(
				"https://api.thedogapi.com/v1/breeds"
			);
			const data = response.data;

			// Obtener los temperamentos únicos de los perros de la API
			const uniqueTemperaments = new Set();
			data.forEach((dog) => {
				if (dog.temperament) {
					const dogTemperaments = dog.temperament.split(", ");
					dogTemperaments.forEach((temperament) =>
						uniqueTemperaments.add(temperament)
					);
				}
			});

			// Guardar los temperamentos en la base de datos
			const temperamentsToCreate = Array.from(uniqueTemperaments).map(
				(temperament) => ({ name: temperament })
			);
			await Temperament.bulkCreate(temperamentsToCreate);

			// Obtener y devolver los temperamentos guardados en la base de datos
			const savedTemperaments = await Temperament.findAll();
			res.status(200).json(savedTemperaments);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al obtener los temperamentos" });
	}
}

module.exports = { getTemperaments };
