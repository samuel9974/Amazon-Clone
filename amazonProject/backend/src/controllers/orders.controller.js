import {
  getOrderById,
  listOrders,
  placeOrder,
} from "../services/order.service.js";

export async function createOrder(req, res) {
  const result = await placeOrder(req.user.id, req.body);
  res.status(201).json(result);
}

export async function getOrders(req, res) {
  const orders = await listOrders(req.user.id);
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await getOrderById(req.user.id, req.params.orderId);
  res.json(order);
}
