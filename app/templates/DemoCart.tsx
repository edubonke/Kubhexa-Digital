"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Trash2 } from "lucide-react";
import { demoCartTotal, demoProducts, type DemoCartItem } from "../../lib/template-demo-data";
import { formatRand } from "../../lib/packages";
import { DemoDialog } from "./DemoShared";

export function DemoCart({ open, onClose, items, setItems }: { open: boolean; onClose: () => void; items: DemoCartItem[]; setItems: (items: DemoCartItem[]) => void }) {
  const [delivery, setDelivery] = useState<"collection" | "delivery">("collection");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(false);
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<"bag" | "review" | "complete">("bag");
  const totals = demoCartTotal(items, delivery, discount);
  const changeQuantity = (index: number, amount: number) => setItems(items.flatMap((item, i) => i !== index ? [item] : item.quantity + amount < 1 ? [] : [{ ...item, quantity: Math.min(10, item.quantity + amount) }]));
  const summary = <dl className="demo-cart-totals"><div><dt>Sample subtotal</dt><dd>{formatRand(totals.subtotal)}</dd></div>{discount && <div><dt>Demo discount (10%)</dt><dd>−{formatRand(totals.discount)}</dd></div>}<div><dt>{delivery === "collection" ? "Collection" : "Sample delivery"}</dt><dd>{formatRand(totals.delivery)}</dd></div><div><dt>Illustrative total</dt><dd>{formatRand(totals.total)}</dd></div></dl>;
  return <DemoDialog open={open} title={stage === "bag" ? "Your sample bag" : stage === "review" ? "Review demo checkout" : "Demo order complete"} onClose={onClose}><div className="demo-cart-content">
    {stage === "complete" ? <div className="demo-order-confirmation" role="status"><Check size={36}/><h2>A good choice.<br/><em>An imagined order.</em></h2>{summary}<p>This is a simulated order. Nothing was purchased, no payment details were collected and no information was sent.</p><button className="demo-button" type="button" onClick={() => { setItems([]); setStage("bag"); setDiscount(false); setCode(""); setMessage(""); onClose(); }}>Continue exploring <ArrowRight size={16}/></button></div> : !items.length ? <div className="demo-empty-cart"><h2>A little room<br/>for something good.</h2><p>Your sample bag is empty. Explore the collection and add an item to try the shopping experience.</p><button className="demo-button" type="button" onClick={onClose}>Explore the collection <ArrowRight size={16}/></button></div> : <>
      <p className="demo-cart-notice">Demo only · illustrative products and prices · no real checkout</p>
      <ul className="demo-cart-items">{items.map((item, index) => { const product = demoProducts.find(product => product.id === item.productId)!; return <li key={`${item.productId}-${item.colour}`}><div><strong>{product.name}</strong><span>{item.colour} · {formatRand(product.price)} each</span></div>{stage === "bag" ? <div className="demo-cart-quantity"><button type="button" aria-label={`Decrease ${product.name} ${item.colour} quantity`} onClick={() => changeQuantity(index, -1)}><Minus size={15}/></button><span aria-label={`${item.quantity} ${item.quantity === 1 ? "item" : "items"}`}>{item.quantity}</span><button type="button" aria-label={`Increase ${product.name} ${item.colour} quantity`} disabled={item.quantity >= 10} onClick={() => changeQuantity(index, 1)}><Plus size={15}/></button><button type="button" aria-label={`Remove ${product.name} ${item.colour}`} onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 size={15}/></button></div> : <span>{item.quantity} × {formatRand(product.price)}</span>}</li>; })}</ul>
      {stage === "bag" && <><label className="demo-delivery-label">Sample fulfilment<select value={delivery} onChange={event => setDelivery(event.target.value as "collection" | "delivery")}><option value="collection">Collection · R0</option><option value="delivery">Sample delivery · R65</option></select></label><div className="demo-coupon"><label htmlFor="demo-coupon">Try code DEMO10 for a sample 10% discount</label><div><input id="demo-coupon" value={code} maxLength={12} onChange={event => setCode(event.target.value)} placeholder="DEMO10" autoComplete="off"/><button className="demo-plain-button" type="button" onClick={() => { const valid = code.trim().toUpperCase() === "DEMO10"; setDiscount(valid); setMessage(valid ? "Demo discount applied." : "That sample code is not recognised. Try DEMO10."); }}>Apply</button></div><p role="status">{message}</p></div></>}
      {summary}
      {stage === "review" && <p className="demo-checkout-explanation">In a real shop, checkout would collect the required delivery details and connect to an approved payment provider. This demo does neither.</p>}
      <div className="demo-cart-actions">{stage === "review" && <button className="demo-plain-button" type="button" onClick={() => setStage("bag")}><ArrowLeft size={16}/> Edit bag</button>}<button className="demo-button" type="button" onClick={() => setStage(stage === "bag" ? "review" : "complete")}>{stage === "bag" ? "Try demo checkout" : "Complete demo order"}<ArrowRight size={16}/></button></div>
    </>}
  </div></DemoDialog>;
}
