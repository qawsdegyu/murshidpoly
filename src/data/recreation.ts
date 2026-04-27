// Mock data for the Recreation / Student Life module.
// All "places" are within walking/short-drive distance from the
// Faculty of Engineering Technology (Polytechnic) in Marka, Amman
// — the area around Pepsi Bridge / Zarqa Highway.

export type RecCategory = "restaurants" | "cafes" | "sports";

export interface MenuItem {
  name: string;
  nameAr: string;
  price: number; // in JOD
}

export interface RecPlace {
  id: string;
  category: RecCategory;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  /** Distance from the Polytechnic (FET) campus in Marka. */
  distance: string;
  distanceAr: string;
  /** $ / $$ / $$$ */
  priceLevel: 1 | 2 | 3;
  phone: string;
  /** Google Maps share/search URL */
  mapsUrl: string;
  /** Optional hero image URL — empty string = use placeholder */
  imageUrl: string;
  menu: MenuItem[];
}

export const recCategoriesMeta: Record<
  RecCategory,
  {
    label: string;
    labelAr: string;
    blurb: string;
    blurbAr: string;
    icon: "UtensilsCrossed" | "Coffee" | "Dumbbell";
    gradient: string; // tailwind from-... to-...
  }
> = {
  restaurants: {
    label: "Marka Restaurants",
    labelAr: "مطاعم ماركا",
    blurb: "Quick bites and full meals around the Polytechnic.",
    blurbAr: "وجبات سريعة وكاملة حول البوليتكنك.",
    icon: "UtensilsCrossed",
    gradient: "from-rose-700 to-orange-500",
  },
  cafes: {
    label: "Cafés & Games",
    labelAr: "كافيهات وألعاب",
    blurb: "Study spots opposite the Polytechnic — billiards & PlayStation.",
    blurbAr: "أماكن دراسة مقابل البوليتكنك، بلياردو وبلايستيشن.",
    icon: "Coffee",
    gradient: "from-amber-700 to-yellow-500",
  },
  sports: {
    label: "Courts & Sports",
    labelAr: "ملاعب ورياضة",
    blurb: "Football pitches, gyms and sports facilities near Marka.",
    blurbAr: "ملاعب كرة قدم، صالات رياضية ومرافق رياضية قرب ماركا.",
    icon: "Dumbbell",
    gradient: "from-emerald-700 to-teal-500",
  },
};

export const recPlaces: RecPlace[] = [
  // ---------- Restaurants ----------
  {
    id: "shawarma-king",
    category: "restaurants",
    name: "Shawarma King — Marka",
    nameAr: "ملك الشاورما — ماركا",
    description: "Famous student-friendly shawarma joint near Pepsi Bridge — quick service and big portions.",
    descriptionAr: "مطعم شاورما محبوب بين طلاب البوليتكنك قرب جسر البيبسي — خدمة سريعة وحصص كبيرة.",
    distance: "5 mins walk",
    distanceAr: "5 دقائق مشياً",
    priceLevel: 1,
    phone: "+962790100001",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shawarma+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Chicken Shawarma Sandwich", nameAr: "ساندويش شاورما دجاج", price: 1.25 },
      { name: "Beef Shawarma Sandwich", nameAr: "ساندويش شاورما لحم", price: 1.75 },
      { name: "Shawarma Plate", nameAr: "صحن شاورما", price: 4.5 },
      { name: "French Fries", nameAr: "بطاطا مقلية", price: 1.0 },
      { name: "Soft Drink", nameAr: "مشروب غازي", price: 0.75 },
    ],
  },
  {
    id: "campus-grill",
    category: "restaurants",
    name: "Marka Grill House",
    nameAr: "بيت المشاوي — ماركا",
    description: "Mixed grill, kebabs and Arabic mezze on Zarqa Highway — a sit-down favorite.",
    descriptionAr: "مشاوي مشكلة وكباب ومقبلات عربية على طريق الزرقاء — مفضل للجلسات.",
    distance: "8 mins walk",
    distanceAr: "8 دقائق مشياً",
    priceLevel: 2,
    phone: "+962790100002",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Grill+Restaurant+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Mixed Grill Plate", nameAr: "صحن مشاوي مشكل", price: 9.0 },
      { name: "Shish Tawook", nameAr: "شيش طاووق", price: 6.5 },
      { name: "Kebab Skewers", nameAr: "أسياخ كباب", price: 7.0 },
      { name: "Hummus", nameAr: "حمص", price: 1.5 },
      { name: "Fattoush Salad", nameAr: "سلطة فتوش", price: 2.0 },
    ],
  },
  {
    id: "pizza-corner",
    category: "restaurants",
    name: "Pizza Corner — Pepsi Bridge",
    nameAr: "ركن البيتزا — جسر البيبسي",
    description: "Wood-fired pizzas and pasta — student combos under 5 JOD.",
    descriptionAr: "بيتزا حطب ومعكرونة — وجبات طلابية بأقل من 5 دنانير.",
    distance: "10 mins walk",
    distanceAr: "10 دقائق مشياً",
    priceLevel: 2,
    phone: "+962790100003",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pizza+Pepsi+Bridge+Amman",
    imageUrl: "",
    menu: [
      { name: "Margherita (Medium)", nameAr: "مارغريتا (وسط)", price: 4.5 },
      { name: "Pepperoni (Large)", nameAr: "بيبروني (كبير)", price: 7.5 },
      { name: "Chicken Ranch Pasta", nameAr: "باستا دجاج رانش", price: 5.0 },
      { name: "Garlic Bread", nameAr: "خبز بالثوم", price: 1.5 },
    ],
  },
  // ---------- Cafés & Games ----------
  {
    id: "study-brew",
    category: "cafes",
    name: "Study & Brew — Opposite Polytechnic",
    nameAr: "ستادي آند برو — مقابل البوليتكنك",
    description: "Quiet specialty coffee shop directly opposite the Polytechnic gate, fast Wi-Fi and power outlets.",
    descriptionAr: "كافيه قهوة مختصة هادئ مقابل بوابة البوليتكنك مباشرة، واي فاي سريع وأماكن للشحن.",
    distance: "3 mins walk",
    distanceAr: "3 دقائق مشياً",
    priceLevel: 2,
    phone: "+962790200001",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cafe+opposite+Polytechnic+Marka",
    imageUrl: "",
    menu: [
      { name: "Espresso", nameAr: "إسبريسو", price: 1.25 },
      { name: "V60 Filter Coffee", nameAr: "قهوة فلتر V60", price: 2.5 },
      { name: "Iced Latte", nameAr: "آيس لاتيه", price: 2.75 },
      { name: "Croissant", nameAr: "كرواسون", price: 1.5 },
    ],
  },
  {
    id: "ps-arena",
    category: "cafes",
    name: "PS Arena Lounge — Marka",
    nameAr: "صالة بلايستيشن أرينا — ماركا",
    description: "PlayStation 5 stations, billiards tables and snacks just a few minutes from the Polytechnic.",
    descriptionAr: "أجهزة بلايستيشن 5، طاولات بلياردو ووجبات خفيفة على بعد دقائق من البوليتكنك.",
    distance: "12 mins walk",
    distanceAr: "12 دقيقة مشياً",
    priceLevel: 1,
    phone: "+962790200002",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=PlayStation+lounge+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "PS5 (per hour)", nameAr: "بلايستيشن 5 (للساعة)", price: 2.0 },
      { name: "Billiards Table (per hour)", nameAr: "طاولة بلياردو (للساعة)", price: 3.0 },
      { name: "FIFA Tournament Entry", nameAr: "اشتراك بطولة فيفا", price: 5.0 },
      { name: "Snack Combo", nameAr: "وجبة خفيفة", price: 2.5 },
    ],
  },
  {
    id: "rooftop-cafe",
    category: "cafes",
    name: "Rooftop Café — Zarqa Highway",
    nameAr: "كافيه السطح — طريق الزرقاء",
    description: "Open-air rooftop with shisha, board games and views over the Zarqa Highway.",
    descriptionAr: "كافيه مفتوح على السطح مع أركيلة وألعاب لوحية وإطلالات على طريق الزرقاء.",
    distance: "15 mins walk",
    distanceAr: "15 دقيقة مشياً",
    priceLevel: 2,
    phone: "+962790200003",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rooftop+Cafe+Zarqa+Highway+Amman",
    imageUrl: "",
    menu: [
      { name: "Cappuccino", nameAr: "كابتشينو", price: 2.0 },
      { name: "Shisha (Two Apples)", nameAr: "أركيلة (تفاحتين)", price: 5.0 },
      { name: "Mojito", nameAr: "موهيتو", price: 3.5 },
      { name: "Mixed Nuts Plate", nameAr: "طبق مكسرات", price: 2.5 },
    ],
  },
  // ---------- Sports ----------
  {
    id: "champions-pitch",
    category: "sports",
    name: "Champions 5-a-Side Pitch — Marka",
    nameAr: "ملعب الأبطال خماسي — ماركا",
    description: "Synthetic-turf football pitch with floodlights for night matches near the Polytechnic.",
    descriptionAr: "ملعب كرة قدم عشب صناعي مع إنارة للمباريات الليلية قرب البوليتكنك.",
    distance: "10 mins drive",
    distanceAr: "10 دقائق بالسيارة",
    priceLevel: 2,
    phone: "+962790300001",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Football+pitch+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Pitch Booking (per hour)", nameAr: "حجز ملعب (للساعة)", price: 25.0 },
      { name: "Night Booking (per hour)", nameAr: "حجز ليلي (للساعة)", price: 35.0 },
      { name: "Ball Rental", nameAr: "استئجار كرة", price: 1.0 },
      { name: "Bibs Set (10)", nameAr: "طقم قمصان (10)", price: 2.0 },
    ],
  },
  {
    id: "powerhouse-gym",
    category: "sports",
    name: "PowerHouse Gym — Marka",
    nameAr: "صالة باور هاوس — ماركا",
    description: "Fully-equipped gym near the Polytechnic with student monthly subscriptions.",
    descriptionAr: "صالة رياضية متكاملة قرب البوليتكنك باشتراكات شهرية للطلاب.",
    distance: "7 mins walk",
    distanceAr: "7 دقائق مشياً",
    priceLevel: 2,
    phone: "+962790300002",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gym+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Day Pass", nameAr: "اشتراك يومي", price: 3.0 },
      { name: "Student Monthly", nameAr: "اشتراك شهري طلابي", price: 18.0 },
      { name: "3-Month Plan", nameAr: "اشتراك 3 شهور", price: 45.0 },
      { name: "Personal Training (session)", nameAr: "تدريب شخصي (حصة)", price: 8.0 },
    ],
  },
  {
    id: "padel-club",
    category: "sports",
    name: "Marka Padel Club",
    nameAr: "نادي ماركا للبادل",
    description: "New padel courts on Zarqa Highway — fastest-growing racket sport in Jordan.",
    descriptionAr: "ملاعب بادل جديدة على طريق الزرقاء — أسرع رياضة مضرب نمواً في الأردن.",
    distance: "12 mins drive",
    distanceAr: "12 دقيقة بالسيارة",
    priceLevel: 3,
    phone: "+962790300003",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Padel+court+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Court (per hour, off-peak)", nameAr: "ملعب (ساعة، خارج الذروة)", price: 15.0 },
      { name: "Court (per hour, peak)", nameAr: "ملعب (ساعة، الذروة)", price: 25.0 },
      { name: "Racket Rental", nameAr: "استئجار مضرب", price: 2.0 },
      { name: "Coaching Session", nameAr: "حصة تدريب", price: 12.0 },
    ],
  },
];

export function priceLevelLabel(level: 1 | 2 | 3): string {
  return "$".repeat(level);
}
