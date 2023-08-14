import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import { ProductManager } from './productManager.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public'))); 

const productManager = new ProductManager(path.join(__dirname, 'products.json')); 

app.get('/', (req, res) => {
  res.render('home', { products: ProductManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: ProductManager.getProducts() });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('createProduct', (product) => {
    ProductManager.addProduct(product);

    // Emitir el evento 'updateProducts' a través de socket.io con la lista de productos actualizada
    io.emit('updateProducts', ProductManager.getProducts());
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});