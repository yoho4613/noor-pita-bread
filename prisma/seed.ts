import { PrismaClient, Product, RoleEnumType } from "@prisma/client";
import bcrypt from "bcryptjs";
import faker from "faker";
import axios from "axios";

const prisma = new PrismaClient();

async function main() {
  // const users = [
  //   {
  //     email: "superadmin@email.com",
  //     password: "superadmin",
  //     name: "superadmin",
  //     role: "superadmin",
  //   },
  //   {
  //     email: "admin@email.com",
  //     password: "admin",
  //     name: "admin",
  //     role: "admin",
  //   },
  // ];

  // await Promise.all(
  //   users.map(async (user) => {
  //     const hasedPassword = await bcrypt.hash(user.password, 10);
  //     await prisma.admin.create({
  //       data: {
  //         email: user.email,
  //         password: hasedPassword,
  //         name: user.name,
  //       },
  //     });
  //   }),
  // );

  // const userPassword = await bcrypt.hash("1234", 10);

  // await prisma.user.create({
  //   data: {
  //     id: "clhkg2ksn000o035oyriu3u9u",
  //     email: "jiho@email.com",
  //     password: userPassword,
  //     name: "jiho park",
  //   },
  // });

  // const categories = [
  //   {
  //     id: "clhkg2ksn000o035oyriu3u9y",
  //     name: "Electronics",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2u9y",
  //     name: "Clothing",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2u9z",
  //     name: "Home and Garden",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v00",
  //     name: "Sports and Outdoors",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v04",
  //     name: "Beauty and Personal Care",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v01",
  //     name: "Books and Literature",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v02",
  //     name: "Toys and Games",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v03",
  //     name: "Food and Beverages",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v13",
  //     name: "Jewelry and Accessories",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v14",
  //     name: "Office Supplies",
  //     product: [],
  //   },
  //   {
  //     id: "clhkg2ksn000o035oyriu2v19",
  //     name: "Pet Supplies",
  //     product: [],
  //   },
  // ];

  // const subcategories = [
  //   {
  //     id: "clhkg2ksn000o135oyriu2u9y",
  //     name: "Smartphones",
  //     categoryId: categories[0]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2u9p",
  //     name: "Laptops",
  //     categoryId: categories[0]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2u9z",
  //     name: "T-shirts",
  //     categoryId: categories[1]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v00",
  //     name: "Dresses",
  //     categoryId: categories[1]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v01",
  //     name: "Furniture",
  //     categoryId: categories[2]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v02",
  //     name: "Gardening Tools",
  //     categoryId: categories[2]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v03",
  //     name: "Hiking Gear",
  //     categoryId: categories[3]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v04",
  //     name: "Camping Equipment",
  //     categoryId: categories[3]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v05",
  //     name: "Skincare",
  //     categoryId: categories[4]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v06",
  //     name: "Haircare",
  //     categoryId: categories[4]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v09",
  //     name: "Snacks",
  //     categoryId: categories[7]?.id,
  //   },
  //   {
  //     id: "clhkg2ksn000o135oyriu2v10",
  //     name: "Beverages",
  //     categoryId: categories[7]?.id,
  //   },
  // ];

  // await Promise.all(
  //   categories.map(
  //     async (category) =>
  //       await prisma.category.create({
  //         data: {
  //           id: category.id,
  //           name: category.name,
  //         },
  //       }),
  //   ),
  // );

  // await Promise.all(
  //   subcategories.map(
  //     async (category) =>
  //       await prisma.subcategory.create({
  //         data: {
  //           id: category.id,
  //           name: category.name,
  //           categoryId: category.categoryId!,
  //         },
  //       }),
  //   ),
  // );

  // const saleData = {
  //   id: "clhkg2ksn000o135oyriu2v11",
  //   title: "Christmas Sale 50%",
  //   subtitle: "Christmas Sale for clothes men and women",
  //   start: new Date(),
  //   expire: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
  // };

  // await prisma.sale.create({
  //   data: {
  //     ...saleData,
  //     method: "percentDiscount",
  //     value: 10,
  //   },
  // });
  // const url = `https://api.unsplash.com/search/photos?page=1&query=ecommerce&client_id=${process.env.IMAGE_API_KEY}`;
  // const res = await axios.get(url);
  // const data = await res.data;
  // const image = data?.results;

  // const products = [];

  // for (const subcategory of subcategories) {
  //   for (let i = 0; i < 13; i++) {
  //     const product = {
  //       title: faker.commerce.productName(),
  //       type: subcategory.name,
  //       description: faker.lorem.sentence(),
  //       rrp: faker.commerce.price(),
  //       price: faker.commerce.price(),
  //       imgUrl: [faker.image.imageUrl()],
  //       attributes: {
  //         color: [
  //           faker.commerce.color(),
  //           faker.commerce.color(),
  //           faker.commerce.color(),
  //           faker.commerce.color(),
  //         ],
  //         size: ["S", "M", "L", "XL"],
  //       },
  //       delivery: faker.datatype.number({ min: 1, max: 7 }),
  //       stock: faker.datatype.number({ min: 1, max: 100 }),
  //       categoryId: subcategory.categoryId,
  //       subcategoryId: subcategory.id,
  //     };

  //     products.push(product);
  //   }
  // }

  // const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

  // const productData: Product[] = [];
  // // Insert mock products into the database
  // await Promise.all(
  //   products.map(
  //     async (product) =>
  //       await prisma.product
  //         .create({
  //           data: {
  //             title: product.title,
  //             type: product.type,
  //             description: product.description,
  //             rrp: product.rrp,
  //             price: product.price,
  //             imgUrl: [
  //               image[getRandomIndex(image.length)].urls.regular,
  //               image[getRandomIndex(image.length)].urls.regular,
  //               image[getRandomIndex(image.length)].urls.regular,
  //               image[getRandomIndex(image.length)].urls.regular,
  //               image[getRandomIndex(image.length)].urls.regular,
  //             ],
  //             attributes: product.attributes,
  //             delivery: product.delivery,
  //             stock: product.stock,
  //             categoryId: product.categoryId!,
  //             subcategoryId: product.subcategoryId
  //               ? product.subcategoryId
  //               : null,
  //             saleId:
  //               product.categoryId === categories[1]?.id ? saleData.id : null,
  //           },
  //         })
  //         .then((res) => {
  //           productData.push(res);
  //         }),
  //   ),
  // );

  // const banners = [
  //   {
  //     title: "Summer Sale",
  //     description: products[5]?.title || "",
  //     link: `/${products[5]?.title}`,
  //     imgUrl: image[0].urls.regular,
  //   },
  //   {
  //     title: "Back to School",
  //     description: products[26]?.title || "",
  //     link: `/${products[26]?.title}`,
  //     imgUrl: image[1].urls.regular,
  //   },
  //   {
  //     title: "Electronics Extravaganza",
  //     description: products[57]?.title || "",
  //     link: `/${products[57]?.title}`,
  //     imgUrl: image[2].urls.regular,
  //   },
  //   {
  //     title: "Fashion Frenzy",
  //     description: products[90]?.title || "",
  //     link: `/${products[90]?.title}`,
  //     imgUrl: image[3].urls.regular,
  //   },
  //   {
  //     title: "Home Makeover",
  //     description: products[80]?.title || "",
  //     link: `/${products[80]?.title}`,
  //     imgUrl: image[4].urls.regular,
  //   },
  // ];

  // await Promise.all(
  //   banners.map(async (banner) => {
  //     await prisma.banner.create({
  //       data: banner,
  //     });
  //   }),
  // );

  // await prisma.banner.create({
  //   data: {
  //     title: "Shoes Limited Sale",
  //     description: products[90]?.title || "",
  //     link: `/${products[90]?.title}`,
  //     imgUrl:
  //       "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtdw1aIPVP6HIYevObQJ-7lr5mIuY9u50OMDsJxYgOAw6ejcuKlyN618d_26BbunWPtpUL4sDWujbmp3UlL-LiEXKScRzcUR99dtgUYfS7qeHJmh-1go5lKlrt2uF_pIVyXmtKp5GjQ7TWJDfW6OnoUEoVgAXqrAkLRZ2yEs7r04G9mn2ITGbmy4bn/w640-h360/Banner%20Design.webp",
  //     position: "heroAlone",
  //   },
  // });

  // for (let i = 0; i < productData.length; i++) {
  //   await prisma.review.create({
  //     data: {
  //       comment: faker.lorem.sentence(),
  //       star: faker.datatype.number({ min: 1, max: 5 }),
  //       productId: productData[i]?.id || productData[0]!.id,
  //       userId: "clhkg2ksn000o035oyriu3u9u",
  //     },
  //   });
  // }
  const productData = await prisma.product.findMany()

  for (let i = 0; i < productData.length; i++) {
    for (let x = 0; x < faker.datatype.number({ min: 9, max: 28 }); i++) {
      if (productData[i] !== undefined && productData[i]?.id !== undefined) {
        await prisma.review.create({
          data: {
            comment: faker.lorem.sentence(),
            star: faker.datatype.number({ min: 1, max: 5 }),
            productId: productData[i]!.id,
            userId: "clhkg2ksn000o035oyriu3u9u",
          },
        });
      }
    }
  }

  // Promise.all(productData.map((product) => {
  //   const randomLengthArr = [...Array(faker.datatype.number({ min: 20, max: 68 }))]
  //         const review = {
  //           comment: randomLengthArr.map(
  //             () => faker.lorem.sentence(),
  //           ),
  //           star: randomLengthArr.map(() =>
  //             faker.datatype.number({ min: 1, max: 5 }),
  //           ),
  //         }
  //         randomLengthArr.map(async (el, i) => await prisma.review.create({
  //           data: {
  //             comment: review.comment[i] || "",
  //             star: review.star[i] || 1,
  //             productId: product.id,
  //             userId: "clhkg2ksn000o035oyriu3u9u"
  //           }
  //         }))
  // }))

  await prisma.$disconnect();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
