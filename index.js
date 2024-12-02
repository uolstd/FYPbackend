const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const stripe = require("stripe")(
  "sk_test_51JBe6yJVCq2psGq9TkXoB9obKsqyzkGUfi4ZQI6RRDZrWt9zDmO0w8IEVtN3xoRmXiNUxm9cHcfjxaBKvcXtjLwm00xeJooxl7"
);
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const UsersModel = require("./models/Users");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.unsubscribe(cors());
app.use(express.static('public'))

mongoose.connect("mongodb://127.0.0.1:27017/user");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});
app.post("/upload", upload.single("file"), (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  UsersModel.create({
    image: req.file.filename,
    name: req.body.Name,
    price: req.body.Price,
  })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});
app.get("/getImage", (req, res) => {
  UsersModel.find()
    .then((us) => res.json(us))
    .catch((err) => res.json(err));
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("Password is incorrect");
      }
    } else {
      res.json("No record exist");
    }
  });
});
app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

//checkout session
app.use(bodyParser.json());

app.post("/create-checkout-session", async (req, res) => {
  const dynamicpro = req.body;
  console.log("This is dynamic data", dynamicpro);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: dynamicpro.name,
          },
          unit_amount: dynamicpro.price + "00", // Amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

// app.get("/Products",async (req,res)=>{
//   let products = await Products.find()
//   res.send(products)
// })

app.listen(3001, () => {
  console.log("Server is running");
});

// new data
app.get("/list", (req, res) => {

  res.send([
    {
      name: "Hot",
      price: "200000",
      first:'Single sofa',
      second:'One bed',
      third:'Two side tables',
      fourth:'Three chairs',
      fifth:'One chest of Drawer'
    },
    {
      name: "Premium",
      price: "215000",
      first:'Two sofa',
      second:'One bed',
      third:'One side table',
      fourth:'Four Chairs chairs',
      fifth:'Two Chest Of Drawers'
    },
    {
      name: "Micro",
      price: "115000",
      first:'Single Chair',
      second:'One bed',
      third:'One side table',
      fourth:'One chair',
      fifth:'One chest of Drawer'
    },
    {
      name: "Sale",
      price: "125000",
      first:'Single sofa',
      second:'One bed',
      third:'Two side tables',
      fourth:'Three chairs',
      fifth:'One chest of Drawer'
    },
   
    
  ]);
});

app.get("/Bundle", (req, res) => {

  res.send([
    {
      name: "Bundle On 50%",
      price: "100000",
      first:'Italic Bed',
      second:'One Chair',
      third:'Two drawers',
      fourth:'One side table',
      fifth:'Book stand'
    }
  ]);
});


app.get("/features", (req, res) => {

  res.send([
    {
      feaure: "Craftsmanship and Artistry",
      featuredesc:'Immerse yourself in a realm of handcrafted excellence, where each piece tells a story of artisanal craftsmanship. Meticulously handmade with an eye for detail, our furniture is more than an addition to your home; it an artistry in wood. From contemporary chic to the timeless allure of classic designs, our collection is a testament to the passion and dedication poured into every creation.'
    },
    {
      feaure: "Sustainability and Style",
      featuredesc:'Embrace sustainable sophistication with our eco-friendly elegance. Our commitment to green living is reflected in every piece, making them not just beautiful but environmentally conscious. Discover a collection that seamlessly blends style and sustainability, where each item is a statement of responsible living. Elevate your space with sustainable statements that speak volumes about your commitment to a greener tomorrow'
    },
    {
      feaure: "Comfortable Sanctuaries",
      featuredesc:'At the heart of our designs lies an unwavering commitment to comfort. Step into a world of plush perfection, where unparalleled comfort meets chic aesthetics. Our furniture transforms your space into a cozy sanctuary, inviting you to unwind and relax in the lap of luxury. Discover the perfect balance of style and comfort that turns your home into a haven of relaxation.'
    },
    {
      feaure: "Bespoke Beauty and Customization",
      featuredesc:'Indulge in bespoke beauty with our custom creations that redefine the concept of personalized luxury. Tailored to perfection, each piece is a manifestation of your unique style. Experience made-to-order magnificence as you explore a world of customizable options, ensuring that your furniture is a true reflection of your individual taste and preferences.'
    }
  ]);
});

app.get("/clinetres", (req, res) => {

  res.send([
    {
      cname: "Mark Henry",
      resp:'I am beyond thrilled with my recent purchase! The attention to detail and quality of craftsmanship exceeded my expectations. The piece not only adds a touch of elegance to my space but also showcases a level of design sophistication that is truly remarkable. Kudos to your team for delivering excellence!'
    },
    {
      cname: "Qutab",
      resp:'I can not thank you enough for the seamless customization process. The ability to tailor the furniture to my specific preferences was a game-changer. The end result is a unique piece that fits perfectly in my home. Your commitment to bespoke beauty truly sets you apart!'
    },
    {
      cname: "Ibraheem",
      resp:'I applaud your commitment to sustainability! Its refreshing to find a furniture brand that not only produces beautiful pieces but also prioritizes environmental responsibility. Knowing that my purchase aligns with eco-friendly practices makes me a proud and satisfied customer.'
    },
    
  ]);
});
app.get("/faqs", (req, res) => {

  res.send([
    {
      cname: "Do you offer international shipping?",
      resp:'Yes, we do! We offer international shipping to several countries. Shipping costs and delivery times may vary based on your location. During the checkout process, you can enter your address to see the available shipping options and associated costs.'
    },
    {
      cname: "How do I care for and maintain my furniture?",
      resp:'Each piece comes with care instructions specific to the material. Generally, we recommend using mild, non-abrasive cleaners and avoiding direct sunlight or excessive moisture. For detailed care guidelines, refer to the care instructions provided with your purchase or contact our customer service team.'
    },
    {
      cname: "Are your products environmentally friendly?",
      resp:'Yes, sustainability is a core value for us. Many of our products are crafted using eco-friendly materials and practices. Look for our "Green Living" label on product pages for items that adhere to our commitment to environmental responsibility.'
    },
    {
      cname: "Can I cancel my order after it has been placed?",
      resp:'To ensure prompt processing, we typically begin fulfilling orders shortly after they are placed. If you need to cancel, please contact our customer service team as soon as possible. Cancellation requests are subject to the order status and processing stage.'
    },
    
  ]);
});

