import { Minus, Plus, X } from "lucide-react";
import type { Product } from "../data/products";

export type CartLine = {
  key: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type Props = {
  open: boolean;
  items: CartLine[];
  onClose: () => void;
  onIncrease: (key: string) => void;
  onDecrease: (key: string) => void;
};

export default function CartDrawer({ open, items, onClose, onIncrease, onDecrease }: Props) {
  if (!open) return null;
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="drawer-head">
          <div><p className="eyebrow">SNC / YOUR SELECTION</p><h2 id="bag-title">THE BAG <span>({items.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, "0")})</span></h2></div>
          <button type="button" onClick={onClose} aria-label="Close bag"><X /></button>
        </div>
        {items.length === 0 ? <p className="empty-bag">Your bag is currently empty.</p> : (
          <div className="bag-items">
            {items.map((line) => (
              <article className="bag-item" key={line.key}>
                <div className="bag-item-info">
                  <b>{line.product.name}</b>
                  <span>{line.color} / {line.size}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => onDecrease(line.key)} aria-label={`Remove one ${line.product.name}`}><Minus size={12} /></button>
                    <span>{line.quantity}</span>
                    <button type="button" onClick={() => onIncrease(line.key)} aria-label={`Add one ${line.product.name}`}><Plus size={12} /></button>
                  </div>
                </div>
                <span>{line.product.priceLabel}</span>
              </article>
            ))}
          </div>
        )}
        <div className="drawer-foot">
          <p>This is a product preview. Checkout, payment and stock are not connected yet.</p>
          <button className="checkout-button" type="button" onClick={onClose}>CONTINUE EXPLORING <span>↗</span></button>
        </div>
      </aside>
    </div>
  );
}