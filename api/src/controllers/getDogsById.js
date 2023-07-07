const { Dog, Temperament } = require("../db");
const axios = require("axios");
const URL = "https://api.thedogapi.com/v1/breeds";
const formatDog = require("../utils/formatDog");

const getDogsById = async (req, res) => {
	const { id } = req.params;
	try {
		let dogDetail;
		const dbDog = await Dog.findByPk(id, {
			include: Temperament,
		});
		if (dbDog) {
			res.status(200).json(dbDog);
		} else {
			const response = await axios.get(URL);
			const data = response.data;
			const apiDog = data.find((dog) => dog.id === parseInt(id));
			if (!apiDog)
				return res
					.status(404)
					.json({ error: "Id de raza no encontrada" });

			dogDetail = formatDog(apiDog);
			res.status(200).json(dogDetail);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error al obtener el detalle del perro",
		});
	}
};

module.exports = { getDogsById };
