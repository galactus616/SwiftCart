require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

// Import Models
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const dummyData = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("Old data cleared!");

    // qCommerce-style categories
    const categories = await Category.insertMany([
      {
        name: "Fruits & Vegetables",
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Dairy & Bakery",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Snacks & Munchies",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Beverages",
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Instant Food",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Atta, Rice & Dal",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Oils & Masala",
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Sweets & Chocolates",
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Personal Care",
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Home Care",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Baby Care",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Meat, Eggs & Seafood",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Frozen Food",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Pet Care",
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Gourmet & World Food",
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Stationery & Office",
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
      },
    ]);
    console.log("Categories seeded!");

    // Create a mapping from category name to its ObjectId
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Helper to generate images array
    const makeImages = (mainUrl) => [
      mainUrl,
      mainUrl + "&img=2",
      mainUrl + "&img=3",
      mainUrl + "&img=4",
      mainUrl + "&img=5"
    ];

    // Helper to generate variants
    const makeVariants = (basePrice, labels = ["Default"], discount = 0.1) =>
      labels.map((label, idx) => {
        const price = Math.round(basePrice * (1 + 0.2 * idx));
        return {
          quantityLabel: label,
          price,
          discountedPrice: Math.round(price * (1 - discount)),
        };
      });

    // Category product templates
    const categoryTemplates = {
      "Fruits & Vegetables": [
        { name: "Apple", basePrice: 120, variants: ["500g", "1kg", "2kg"], img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80" },
        { name: "Banana", basePrice: 60, variants: ["6 pcs", "12 pcs"], img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80" },
        { name: "Tomato", basePrice: 40, variants: ["500g", "1kg"], img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
        { name: "Spinach", basePrice: 30, variants: ["250g", "500g"], img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
        { name: "Carrot", basePrice: 50, variants: ["500g", "1kg"], img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
        { name: "Potato", basePrice: 35, variants: ["1kg", "2kg"], img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
        { name: "Onion", basePrice: 45, variants: ["1kg", "2kg"], img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
        { name: "Mango", basePrice: 150, variants: ["1kg"], img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80" },
      ],
      "Dairy & Bakery": [
        { name: "Milk", basePrice: 55, variants: ["500ml", "1L", "2L"], img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" },
        { name: "Paneer", basePrice: 90, variants: ["200g", "500g"], img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
        { name: "Butter", basePrice: 80, variants: ["100g", "200g"], img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
        { name: "Brown Bread", basePrice: 45, variants: ["400g"], img: "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80" },
        { name: "Eggless Cake", basePrice: 200, variants: ["500g", "1kg"], img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
        { name: "Curd", basePrice: 60, variants: ["200g", "400g", "1kg"], img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" },
        { name: "Cheese", basePrice: 120, variants: ["100g", "200g"], img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
        { name: "White Bread", basePrice: 40, variants: ["400g"], img: "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80" },
      ],
      // ... Repeat for all categories, with 4 or 8 products each, randomizing as you go ...
    };

    // Build productDefs from templates
    const productDefs = [];
    Object.entries(categoryTemplates).forEach(([cat, products]) => {
      // Randomly pick 4 or 8 products for each category
      const count = Math.random() < 0.5 ? 4 : 8;
      const chosen = products.slice(0, count);
      chosen.forEach(prod => {
        const variants = makeVariants(prod.basePrice, prod.variants);
        productDefs.push({
          name: prod.name,
          category: cat,
          price: variants[0].price,
          discountedPrice: variants[0].discountedPrice,
          imageUrl: prod.img,
          images: makeImages(prod.img),
          description: `Fresh ${prod.name} from our ${cat} section.`,
          isBestSeller: Math.random() < 0.3,
          isFeatured: Math.random() < 0.3,
          variants,
        });
      });
    });

    // Validate and map product categories
    const validProducts = [];
    productDefs.forEach(p => {
      if (!categoryMap[p.category]) {
        // skip, but with new categories this should not happen
      } else {
        validProducts.push({
          ...p,
          category: categoryMap[p.category],
          images: p.images || makeImages(p.imageUrl),
          discountedPrice: p.discountedPrice || Math.round(p.price * 0.9),
          variants: p.variants || [{ quantityLabel: "Default", price: p.price, discountedPrice: Math.round(p.price * 0.9) }],
        });
      }
    });

    const products = await Product.insertMany(validProducts);
    console.log("Products seeded!");

    const user = await User.create({
      name: "Test User",
      address: "123 Main St, Anytown, CA 90210",
      phone: "9876543210",
    });
    console.log("Dummy user seeded!");

    // Use only valid product indices for dummy cart and orders
    const safeProduct = (arr, idx) => arr[idx] || arr[0];

    // const dummyCart = await Cart.create({
    //   userId: user._id,
    //   items: [
    //     { productId: safeProduct(products, 0)._id, variantIndex: 0, quantity: 2 },
    //     { productId: safeProduct(products, 1)._id, variantIndex: 0, quantity: 1 },
    //   ],
    // });
    // console.log("Dummy cart seeded!");

    // await Order.insertMany([
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-001`,
    //     date: new Date("2025-06-25"),
    //     total: 250,
    //     status: "Delivered",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 0)._id,
    //           name: safeProduct(products, 0).name,
    //           price: safeProduct(products, 0).price,
    //           imageUrl: safeProduct(products, 0).imageUrl,
    //         },
    //         quantity: 2,
    //       },
    //       {
    //         product: {
    //           id: safeProduct(products, 1)._id,
    //           name: safeProduct(products, 1).name,
    //           price: safeProduct(products, 1).price,
    //           imageUrl: safeProduct(products, 1).imageUrl,
    //         },
    //         quantity: 1,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-002`,
    //     date: new Date("2025-06-20"),
    //     total: 120,
    //     status: "Delivered",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 2)._id,
    //           name: safeProduct(products, 2).name,
    //           price: safeProduct(products, 2).price,
    //           imageUrl: safeProduct(products, 2).imageUrl,
    //         },
    //         quantity: 1,
    //       },
    //       {
    //         product: {
    //           id: safeProduct(products, 3)._id,
    //           name: safeProduct(products, 3).name,
    //           price: safeProduct(products, 3).price,
    //           imageUrl: safeProduct(products, 3).imageUrl,
    //         },
    //         quantity: 2,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-003`,
    //     date: new Date("2025-06-18"),
    //     total: 180,
    //     status: "Cancelled",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 4)._id,
    //           name: safeProduct(products, 4).name,
    //           price: safeProduct(products, 4).price,
    //           imageUrl: safeProduct(products, 4).imageUrl,
    //         },
    //         quantity: 3,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    // ]);
    // console.log("Dummy orders seeded!");

    console.log("Data seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

dummyData();
