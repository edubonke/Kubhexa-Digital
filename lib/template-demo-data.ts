export const bookingServices = [
  { id: "cut", name: "Signature cut & finish", duration: 60, price: 450, copy: "A consultation, considered cut and a finish that feels like you." },
  { id: "treatment", name: "Scalp & care ritual", duration: 45, price: 350, copy: "A quiet reset with a gentle scalp ritual and nourishing treatment." },
  { id: "style", name: "Occasion styling", duration: 75, price: 650, copy: "A little extra attention for a day you want to remember." },
] as const;
export const demoDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export const demoTimes = ["09:00", "10:30", "12:00", "14:00", "15:30"] as const;

export const demoProducts = [
  { id: "vase", name: "Arc ceramic vase", category: "Home", price: 360, art: "vase", copy: "A sculptural shape for stems, shelves and quiet corners." },
  { id: "linen", name: "Everyday linen", category: "Everyday", price: 280, art: "linen", copy: "Soft texture and a simple weave for the everyday table." },
  { id: "cup", name: "Slow morning cup", category: "Everyday", price: 160, art: "cup", copy: "A generous cup for the first pause of the day." },
  { id: "lamp", name: "Dome table lamp", category: "Home", price: 720, art: "lamp", copy: "An architectural silhouette with a warm, easy presence." },
  { id: "bowl", name: "Gather serving bowl", category: "Gifts", price: 420, art: "bowl", copy: "A useful centrepiece, made for sharing around the table." },
  { id: "bag", name: "Market day tote", category: "Gifts", price: 320, art: "bag", copy: "A roomy everyday companion with clean, durable lines." },
] as const;
export type DemoProductId = typeof demoProducts[number]["id"];
export const demoColours = ["Sand", "Charcoal"] as const;
export type DemoColour = typeof demoColours[number];
export type DemoCartItem = { productId: DemoProductId; colour: DemoColour; quantity: number };
export function demoCartTotal(items: readonly DemoCartItem[], delivery: "collection" | "delivery", discount: boolean) {
  if (!["collection", "delivery"].includes(delivery)) throw new Error("Choose a delivery option.");
  let subtotal = 0;
  for (const item of items) {
    const product = demoProducts.find(product => product.id === item.productId);
    if (!product || !demoColours.some(colour => colour === item.colour) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) throw new Error("Invalid demo cart item.");
    subtotal += product.price * item.quantity;
  }
  const discountAmount = discount ? Math.round(subtotal * .1) : 0;
  const deliveryFee = items.length && delivery === "delivery" ? 65 : 0;
  return { subtotal, discount: discountAmount, delivery: deliveryFee, total: subtotal - discountAmount + deliveryFee };
}

export const menuItems = [
  { id: "toast", name: "Garden breakfast toast", category: "Breakfast", price: 95, vegetarian: true, copy: "Sourdough, smashed avocado, tomato and fresh herbs.", detail: "Sample dietary information: contains gluten. Ask your real restaurant about allergens and substitutions." },
  { id: "bowl", name: "Market garden bowl", category: "Lunch", price: 125, vegetarian: true, copy: "Roasted seasonal vegetables, grains and a lemon dressing.", detail: "Sample dietary information: vegetarian. Ingredients and dietary claims must be confirmed by the actual business." },
  { id: "chicken", name: "Herb-roasted chicken", category: "Lunch", price: 155, vegetarian: false, copy: "Roasted chicken, crisp potatoes and a bright herb sauce.", detail: "A sample main course to demonstrate menu details. No food order is placed in this demo." },
  { id: "coffee", name: "House flat white", category: "Drinks", price: 38, vegetarian: true, copy: "A short double shot with silky textured milk.", detail: "Sample dietary information: contains dairy. Alternative milk options depend on the actual restaurant." },
  { id: "tea", name: "Rooibos & citrus", category: "Drinks", price: 35, vegetarian: true, copy: "A South African favourite with a slice of fresh citrus.", detail: "An illustrative drinks listing. Menu items, ingredients and prices are sample content." },
  { id: "eggs", name: "Slow Sunday eggs", category: "Breakfast", price: 110, vegetarian: true, copy: "Soft eggs, roasted tomatoes and toasted sourdough.", detail: "Sample dietary information: contains egg and gluten. This is a fictional menu." },
] as const;

export const creativeProjects = [
  { id: "origin", name: "Origin / Brand direction", category: "Brand", art: "poster", copy: "An expressive identity exploring confident type, warm colour and a simple geometric language.", scope: "Identity concept · Art direction · Print studies" },
  { id: "frame", name: "Frame / Digital experience", category: "Web", art: "screen", copy: "An editorial website study that brings the work forward with generous rhythm and clear navigation.", scope: "Website concept · Interface design · Responsive layout" },
  { id: "still", name: "Still / Spatial story", category: "Spaces", art: "space", copy: "A visual exploration of shape, material and the spaces between objects.", scope: "Illustration · Composition · Colour study" },
  { id: "gather", name: "Gather / Packaging study", category: "Brand", art: "package", copy: "A sample packaging system built around an understated mark and tactile colour combinations.", scope: "Packaging concept · Brand applications · Illustration" },
] as const;
