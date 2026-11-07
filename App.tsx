import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag, X, Plus } from "lucide-react";
import Orb from "./components/Orb";
import CartDrawer, { type CartLine } from "./components/CartDrawer";
import BrandLogo from "./components/BrandLogo";
import ProductPage from "./components/ProductPage";
import { products, type Product } from "./data/products";

gsap.registerPlugin(ScrollTrigger);

function ProductVisual({ product }: { product: Product }) {
  return (
    <div className={`product-visual product-visual-photo ${product.tone}`}>
      <img src={product.image} alt={`${product.name} — original SNC product reference`} loading="lazy" />
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = window.localStorage.getItem("snc-preview-bag-v1");
      if (!saved) return [];
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap((entry): CartLine[] => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as { productId?: unknown; quantity?: unknown; size?: unknown; color?: unknown };
        const product = products.find((candidate) => candidate.id === item.productId);
        if (!product || !Number.isInteger(item.quantity) || (item.quantity as number) < 1 ||
            typeof item.size !== "string" || typeof item.color !== "string") return [];
        return [{
          key: `${product.id}::${item.size}::${item.color}`,
          product,
          quantity: item.quantity as number,
          size: item.size,
          color: item.color,
        }];
      });
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const bagButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      const compact = cart.map(({ product, quantity, size, color }) => ({
        productId: product.id, quantity, size, color,
      }));
      window.localStorage.setItem("snc-preview-bag-v1", JSON.stringify(compact));
    } catch {
      // Storage can be unavailable in private browsing; the in-memory bag still works.
    }
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 28, opacity: 0, duration: 1, stagger: 0.13, ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 34, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });
      gsap.to(".hero-orbit", {
        yPercent: 18, rotate: 8, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const addToBag = (product: Product, selection: { size: string; color: string }) => {
    const key = `${product.id}::${selection.size}::${selection.color}`;
    setCart((items) => {
      const existing = items.find((line) => line.key === key);
      if (existing) return items.map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line);
      return [...items, { key, product, quantity: 1, ...selection }];
    });
    setNotice(`${product.name} added to preview bag`);
  };

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const increase = useCallback((productId: string) => {
    setCart((items) => items.map((line) =>
      line.key === productId ? { ...line, quantity: line.quantity + 1 } : line,
    ));
  }, []);
  const decrease = useCallback((productId: string) => {
    setCart((items) => items
      .map((line) => line.key === productId
        ? { ...line, quantity: line.quantity - 1 }
        : line)
      .filter((line) => line.quantity > 0));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="announcement">INDEPENDENT BY DESIGN <span>—</span> ATHENS / EVERYWHERE</div>
      <header className="header">
        <a className="wordmark" href="#top" aria-label="SNC home"><BrandLogo /></a>
        <nav id="primary-navigation" className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
          <a href="#identity" onClick={closeMenu}>THE BRAND</a>
          <a href="#collection" onClick={closeMenu}>COLLECTION</a>
          <a href="#world" onClick={closeMenu}>THE WORLD</a>
          <a href="#contact" onClick={closeMenu}>CONTACT</a>
        </nav>
        <div className="header-actions">
          <button
            ref={bagButtonRef}
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag, ${total} items`}
            aria-haspopup="dialog"
          >
            <ShoppingBag size={14} /> BAG <span>({total.toString().padStart(2, "0")})</span>
          </button>
          <button
            ref={menuButtonRef}
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
      {selectedProduct ? (
        <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onAdd={addToBag} />
      ) : <>
      <section className="hero" id="top">
        <div className="hero-grain" />
        <div className="hero-topline"><span>FIG. 001 — THE NEW STANDARD</span><span>EST. IN MOTION</span></div>
        <div className="hero-orbit" aria-hidden="true"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><div className="hero-cross">✳</div></div>
        <div className="hero-copy">
          <p className="eyebrow">NOT MADE TO FOLLOW.</p>
          <h1>BEYOND<br /><em>THE</em> ORDINARY<span className="period">.</span></h1>
          <div className="hero-bottom">
            <p>Independent streetwear.<br />A different point of view.</p>
            <a className="round-link" href="#collection" aria-label="Explore collection"><ArrowDown /></a>
          </div>
        </div>
        <div className="hero-side-note">SNC / CREATIVE DIVISION<br />01 — 04 / 2026</div>
        <div className="hero-index">01<span>—</span>04</div>
      </section>

      <section className="intro section-pad" id="identity">
        <div className="section-kicker reveal"><span>01 / IDENTITY</span><span>THE FOUNDATION</span></div>
        <div className="intro-grid">
          <h2 className="reveal">A STUDY IN<br /><span>CONTRAST.</span></h2>
          <div className="intro-copy reveal">
            <p className="large-copy">SNC exists between structure and freedom. Between the everyday and the unexpected.</p>
            <p className="muted-copy">A developing independent streetwear label shaped by movement, culture and a distinct visual language. Built to evolve. Designed to stand apart.</p>
            <a className="text-link" href="#world">DISCOVER THE POINT OF VIEW <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="intro-line"><span>FORM / FUNCTION / FREEDOM</span><span>ATHENS, GR</span></div>
      </section>

      <section className="world section-pad" id="world">
        <div className="section-kicker reveal"><span>02 / THE WORLD</span><span>AN ONGOING EXPERIMENT</span></div>
        <div className="world-stage">
          <div className="world-copy reveal"><p className="eyebrow">A DIGITAL OBJECT</p><h2>FORM<br />IN<br /><i>MOTION.</i></h2><p>Explore the object. Move through the details. The SNC universe is always in progress.</p></div>
          <Orb />
          <div className="world-caption"><span>OBJECT 001</span><span>INTERACTIVE / WEBGL</span><span>WEBGL EXPERIENCE</span></div>
        </div>
      </section>

      <section className="collection section-pad" id="collection">
        <div className="section-kicker reveal"><span>03 / COLLECTION</span><span>THE FIRST SNC PIECES</span></div>
        <div className="collection-heading reveal"><h2>THE<br /><i>UNIFORM.</i></h2><p>The first SNC pieces.<br />Presented in their original designs.</p></div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card reveal" key={product.id}>
              <button className="product-card-open" onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: "auto" }); }} aria-label={`View ${product.name} details`}>
                <ProductVisual product={product} />
              </button>
              <div className="product-meta">
                <div><span className="product-tag">{product.tag}</span><h3>{product.name}</h3><p>{product.category}</p></div>
                <button className="add-button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name} options`}><Plus /></button>
              </div>
              <div className="product-price"><span>{product.category}</span><strong>{product.priceLabel}</strong></div>
            </article>
          ))}
        </div>
        <p className="concept-note">PRODUCT PREVIEW — Prices shown as provided. Checkout and stock are not connected yet.</p>
      </section>

      <section className="manifesto">
        <div className="manifesto-bg" aria-hidden="true">SNC</div>
        <div className="manifesto-content reveal"><p className="eyebrow">04 / THE MANIFESTO</p><h2>NO FIXED<br /><i>DIRECTION.</i></h2><p>THE ONLY CONSTANT IS MOVEMENT.</p><a href="#contact" className="manifesto-link">STAY IN THE LOOP <ArrowUpRight size={16} /></a></div>
      </section>
      </>}
      </main>

      <footer id="contact" className="footer section-pad">
        <div className="footer-top"><a className="footer-logo" href="#top" aria-label="SNC home"><BrandLogo loading="lazy" /></a><p>BEYOND THE ORDINARY.<br />INDEPENDENT BY DESIGN.</p><a className="back-top" href="#top">BACK TO TOP ↑</a></div>
        <div className="footer-bottom"><span>© SNC 2026 — CONCEPT PREVIEW</span><span>ATHENS / WORLDWIDE</span><span className="contact-pending">CONTACT DETAILS TBC</span></div>
      </footer>

      {notice && <div className="toast" role="status" aria-live="polite">{notice}</div>}
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={closeCart}
        onIncrease={increase}
        onDecrease={decrease}
      />
    </>
  );
}
