import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import exphbs from 'express-handlebars';
import { readFileSync, writeFileSync } from 'node:fs';
import { ProductManager } from './productManager';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

const productManager = new ProductManager('products.json'); // Cambiar por la ruta correcta

app.get('/', (req, res) => {
  res.render('home', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: productManager.getProducts() });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('createProduct', (product) => {
    productManager.addProduct(product);

    // Emitir el evento 'updateProducts' a través de socket.io con la lista de productos actualizada
    io.emit('updateProducts', productManager.getProducts());
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});