import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../services/cart.service.js";

export async function getUserCart(req, res) {
  const cart = await getCart(req.user.id);
  res.json(cart);
}

export async function addCartItem(req, res) {
  const cart = await addToCart(req.user.id, req.body);
  res.status(201).json(cart);
}

export async function patchCartItem(req, res) {
  const cart = await updateCartItem(req.user.id, req.params.productId, req.body);
  res.json(cart);
}

export async function deleteCartItem(req, res) {
  const cart = await removeFromCart(req.user.id, req.params.productId);
  res.json(cart);
}
