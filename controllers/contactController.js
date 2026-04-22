const sendMessage = (req, res) => {
  const { name, email, message } = req.body;

  
  if (!name || !email || !message) {
     return res.status(400).json({ error: 'Faltan datos: name, email, message' });
  }


  res.json({ message: 'Mensaje de contacto recibido', data: { name, email, message } });
};

module.exports = { sendMessage };
