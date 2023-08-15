import express from 'express';
import { ProductManager } from '../productManager';

const viewsRouter = express.Router();

// Ruta para la vista de inicio
viewsRouter.get('/', (req, res) => {
  res.render('home', { products: ProductManager.getProducts() });
});

// Ruta para la vista en tiempo real de productos
viewsRouter.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: ProductManager.getProducts() });
});

export default viewsRouter;

