const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const service = await Service.create({ nombre, descripcion, precio });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servicio', error });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios', error });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    await service.update({ nombre, descripcion, precio });
    res.json({ message: 'Servicio actualizado', service });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

    await service.destroy();
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error });
  }
};

