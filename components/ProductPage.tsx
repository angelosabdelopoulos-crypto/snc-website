import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import type { Product } from "../data/products";

type Props = {
  product: Product;
  onBack: () => void;
  onAdd: (product: Product, selection: { size: string; color: string }) => void;
};

export default function ProductPage({ product, onBack, onAdd }: Props) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  const add = () => {
    onAdd(product, { size, color });
    setAdded(true);
  };

  return (
    <section className="product-page section-pad" aria-labelledby="product-title">
      <div className="product-page-top">
        <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={14} /> BACK TO COLLECTION</button>
        <span>{product.tag} / SNC OBJECTS</span>
      </div>
      <div className="product-detail-grid">
        <div className={`product-gallery-main ${product.tone}`}>
          <img className="product-detail-image" src={product.image} alt={product.name} />
          <span className="gallery-index">SNC — OBJECT / {product.id}</span>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.tag} — {product.category}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price">{product.priceLabel}</div>
          <div className="option-group">
            <span className="option-label">COLOR / {color.toUpperCase()}</span>
            <div className="option-list">
              {product.colors.map((item) => <button type="button" key={item} className={color === item ? "option-chip selected" : "option-chip"} onClick={() => setColor(item)} aria-pressed={color === item}>{item}</button>)}
            </div>
          </div>
          <div className="option-group">
            <span className="option-label">SELECT SIZE</span>
            <div className="option-list">
              {product.sizes.map((item) => <button type="button" key={item} className={size === item ? "option-chip selected" : "option-chip"} onClick={() => setSize(item)} aria-pressed={size === item}>{item}</button>)}
            </div>
          </div>
          <button className="product-add-button" type="button" onClick={add}><Plus size={15} /> {added ? "ADD ANOTHER" : "ADD TO BAG"}</button>
          <p className="product-disclaimer">PREVIEW ONLY — COMMERCE WILL BE CONNECTED BEFORE LAUNCH.</p>
        </div>
      </div>
    </section>
  );
}