const { Dog, Temperament, conn } = require("../db");
const { Op } = require("sequelize");

async function createDog(req, res) {
	const { name, image, height, weight, life_span, temperament, id } =
		req.body;

	try {
		const createdDog = await conn.transaction(async (transaction) => {
			const dog = await Dog.create(
				{
					id,
					name,
					image,
					height,
					weight,
					life_span,
					temperament: Array.isArray(temperament)
						? temperament
						: [temperament], // Convertir a un array si no lo es
				},
				{ transaction }
			);

			if (temperament && temperament.length > 0) {
				const foundTemperaments = await Temperament.findAll({
					where: {
						name: {
							[Op.in]: temperament,
						},
					},
					transaction,
				});

				await dog.setTemperaments(foundTemperaments, { transaction });
			}

			return dog;
		});

		res.status(201).json(createdDog);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al crear el perro" });
	}
}

module.exports = { createDog };
