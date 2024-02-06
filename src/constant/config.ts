import tom from '../../public/Tom.jpeg'
import emma from '../../public/Emma.jpeg'
import will from '../../public/Will.webp'

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const defaultUserDetail = {
  id: "",
  name: "",
  email: "",
  image: "",
  cart: [],
  emailVerified: null,
  watchlist: [],
  purchase: [],
  address: null,
  role: "customer",
  createdAt: new Date(),
};

export const defaultCategories = [

]

export const defaultProducts = [
  
]

export const defaultRandomProducts = []

export const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const initialProductForm = {
  id: "",
  title: "",
  description: "",
  type: "",
  rrp: "",
  price: "",
  stock: 0,
  categoryId: "",
  subcategoryId: "",
  saleId: "",
  delivery: 0,
  imgUrl: [],
  attributes: {},
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const STAFF = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedIn: "https://linkedin.com",
    image: tom
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedIn: "https://linkedin.com",
    image: emma
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedIn: "https://linkedin.com",
    image: will
  },
];
