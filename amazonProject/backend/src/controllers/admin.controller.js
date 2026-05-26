import {
  createProduct,
  deleteProduct,
  listAllOrders,
  updateOrderStatus,
  updateProduct,
} from "../services/admin.service.js";

export async function getOrders(req, res) {
  const orders = await listAllOrders();
  res.json(orders);
}

export async function patchOrder(req, res) {
  const order = await updateOrderStatus(req.params.orderId, req.body);
  res.json(order);
}

export async function postProduct(req, res) {
  const product = await createProduct(req.body);
  res.status(201).json(product);
}

export async function putProduct(req, res) {
  const product = await updateProduct(req.params.id, req.body);
  res.json(product);
}

export async function removeProduct(req, res) {
  await deleteProduct(req.params.id);
  res.status(204).send();
}
