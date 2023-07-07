const formatDog = (dog) => {
	return {
		id: dog.id,
		name: dog.name,
		image: dog.image.url,
		height: dog.height.metric,
		weight: dog.weight.metric,
		life_span: dog.life_span,
		temperament: dog.temperament ? dog.temperament.split(", ") : [],
	};
};

module.exports = formatDog;
