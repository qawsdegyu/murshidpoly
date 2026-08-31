// Mock data for the Recreation / Student Life module.
// All "places" are within walking/short-drive distance from the
// Faculty of Engineering Technology (Polytechnic) in Marka, Amman
// — the area around Pepsi Bridge / Zarqa Highway.

export type RecCategory = "restaurants_inside" | "restaurants_outside" | "cafes" | "university_life";

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
  iconName?: string;
}

export const recCategoriesMeta: Record<
  RecCategory,
  {
    label: string;
    labelAr: string;
    blurb: string;
    blurbAr: string;
    icon: string;
    gradient: string; // tailwind from-... to-...
  }
> = {
  restaurants_inside: {
    label: "On-Campus Dining",
    labelAr: "مطاعم داخل الجامعة",
    blurb: "Restaurants and cafeterias inside or very close to the campus gate.",
    blurbAr: "مطاعم وكافتيريات داخل الحرم الجامعي أو قريبة جداً من البوابات.",
    icon: "UtensilsCrossed",
    gradient: "from-rose-700 to-orange-500",
  },
  restaurants_outside: {
    label: "Off-Campus Dining",
    labelAr: "مطاعم خارج الجامعة",
    blurb: "Popular food spots and restaurants around the Marka area.",
    blurbAr: "أبرز مطاعم ومحلات الأكل في منطقة ماركا المحيطة.",
    icon: "Store",
    gradient: "from-orange-600 to-amber-500",
  },
  cafes: {
    label: "Cafés & Study Spots",
    labelAr: "كافيهات وأماكن دراسة",
    blurb: "Study-friendly cafes and student hangouts near the Polytechnic.",
    blurbAr: "كافيهات مناسبة للدراسة وتجمعات الطلاب قرب البوليتكنك.",
    icon: "Coffee",
    gradient: "from-amber-700 to-yellow-500",
  },
  university_life: {
    label: "Campus Life & Sports",
    labelAr: "ملاعب وخدمات ترفيهية",
    blurb: "On-campus sports facilities, bookshops, and student entertainment.",
    blurbAr: "الملاعب، المكتبة، والخدمات الترفيهية داخل الحرم الجامعي.",
    icon: "Trophy",
    gradient: "from-emerald-700 to-teal-500",
  },
};

export const recPlaces: RecPlace[] = [
  // ---------- Inside Restaurants ----------
  {
    id: "campus-cafeteria",
    category: "restaurants_inside",
    name: "Main Campus Cafeteria",
    nameAr: "كافتيريا الجامعة الرئيسية",
    description: "The primary dining hall inside the university, serving daily meals and quick snacks.",
    descriptionAr: "كافتيريا الجامعة الرئيسية، تقدم وجبات يومية وساندويشات سريعة للطلاب.",
    distance: "1 min walk",
    distanceAr: "دقيقة واحدة مشياً",
    priceLevel: 1,
    phone: "+962790100000",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Polytechnic+University+Cafeteria+Amman",
    imageUrl: "",
    menu: [
      { name: "Daily Meal", nameAr: "الوجبة اليومية", price: 2.5 },
      { name: "Chicken Sandwich", nameAr: "ساندويش دجاج", price: 1.0 },
      { name: "Tea", nameAr: "شاي", price: 0.25 },
    ],
  },
  {
    id: "poly-gate-shawarma",
    category: "restaurants_inside",
    name: "Gate Shawarma",
    nameAr: "شاورما البوابة",
    description: "Located right at the university gate, a student favorite for a quick bite between lectures.",
    descriptionAr: "يقع مباشرة عند بوابة الجامعة، المفضل للطلاب للوجبات السريعة بين المحاضرات.",
    distance: "2 mins walk",
    distanceAr: "دقيقتان مشياً",
    priceLevel: 1,
    phone: "+962790100001",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shawarma+near+Polytechnic+Amman",
    imageUrl: "",
    menu: [
      { name: "Shawarma Wrap", nameAr: "ساندويش شاورما", price: 1.25 },
      { name: "Fries Box", nameAr: "بطاطا مقلية", price: 1.0 },
    ],
  },

  // ---------- Outside Restaurants ----------
  {
    id: "shawarma-king",
    category: "restaurants_outside",
    name: "Shawarma King — Marka",
    nameAr: "ملك الشاورما — ماركا",
    description: "Famous shawarma joint near Pepsi Bridge — quick service and big portions.",
    descriptionAr: "مطعم شاورما محبوب قرب جسر البيبسي — خدمة سريعة وحصص كبيرة.",
    distance: "5 mins drive",
    distanceAr: "5 دقائق بالسيارة",
    priceLevel: 1,
    phone: "+962790100002",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shawarma+Marka+Amman",
    imageUrl: "",
    menu: [
      { name: "Double Shawarma", nameAr: "شاورما دبل", price: 2.5 },
      { name: "Arabic Plate", nameAr: "وجبة عربي", price: 3.5 },
    ],
  },
  {
    id: "pizza-corner",
    category: "restaurants_outside",
    name: "Pizza Corner — Pepsi Bridge",
    nameAr: "ركن البيتزا — جسر البيبسي",
    description: "Wood-fired pizzas and pasta — student combos under 5 JOD.",
    descriptionAr: "بيتزا حطب ومعكرونة — وجبات طلابية بأقل من 5 دنانير.",
    distance: "10 mins drive",
    distanceAr: "10 دقائق بالسيارة",
    priceLevel: 2,
    phone: "+962790100003",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pizza+Pepsi+Bridge+Amman",
    imageUrl: "",
    menu: [
      { name: "Margherita", nameAr: "مارغريتا", price: 4.5 },
      { name: "Pepperoni", nameAr: "بيبروني", price: 5.5 },
    ],
  },

  // ---------- Cafés ----------
  {
    id: "study-brew",
    category: "cafes",
    name: "Study & Brew — Opposite Polytechnic",
    nameAr: "ستادي آند برو — مقابل البوليتكنك",
    description: "Quiet specialty coffee shop directly opposite the gate, fast Wi-Fi and power outlets.",
    descriptionAr: "كافيه قهوة مختصة هادئ مقابل البوابة، واي فاي سريع وأماكن للشحن.",
    distance: "3 mins walk",
    distanceAr: "3 دقائق مشياً",
    priceLevel: 2,
    phone: "+962790200001",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cafe+opposite+Polytechnic+Marka",
    imageUrl: "",
    menu: [
      { name: "Iced Latte", nameAr: "آيس لاتيه", price: 2.75 },
      { name: "Espresso", nameAr: "إسبريسو", price: 1.5 },
    ],
  },

  // ---------- University Life (Sports & Entertainment) ----------
  {
    id: "football-court-inside",
    category: "university_life",
    name: "University Football Pitch",
    nameAr: "ملعب الجامعة لكرة القدم",
    description: "The main on-campus football field for student tournaments and recreation.",
    descriptionAr: "ملعب كرة القدم الرئيسي داخل الحرم الجامعي للبطولات الطلابية والترفيه.",
    distance: "Inside Campus",
    distanceAr: "داخل الحرم الجامعي",
    priceLevel: 1,
    phone: "N/A",
    mapsUrl: "",
    imageUrl: "",
    iconName: "Trophy",
    menu: [
      { name: "Court Booking", nameAr: "حجز الملعب", price: 0 },
    ],
  },
  {
    id: "main-bookshop",
    category: "university_life",
    name: "Central University Bookshop",
    nameAr: "مكتبة الجامعة المركزية",
    description: "Your go-to spot for books, stationery, and photocopying services inside the campus.",
    descriptionAr: "المكان المخصص للكتب، القرطاسية، وخدمات التصوير داخل الحرم الجامعي.",
    distance: "Inside Campus",
    distanceAr: "داخل الحرم الجامعي",
    priceLevel: 1,
    phone: "N/A",
    mapsUrl: "",
    imageUrl: "",
    iconName: "BookOpen",
    menu: [
      { name: "Photocopy (per page)", nameAr: "تصوير (للصفحة)", price: 0.05 },
      { name: "Engineering Notebook", nameAr: "دفتر هندسي", price: 1.5 },
    ],
  },
];

export function priceLevelLabel(level: any): string {
  const num = parseInt(level, 10);
  if (isNaN(num) || num < 1) return "$";
  return "$".repeat(Math.min(num, 5));
}
