import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

//allow morgan logger to get access to each request before and after our handlers
app.use(morgan("dev"));
//auto-include CORS headers to allow consumption of our content by in-browser js loaded from elsewhere
app.use(cors());
//parse body text of requests having content-type application/json, attaching result to `req.body`
app.use(express.json());

//used to initially test if the set up works
app.get("/", (req, res) => {
    res.send("Hello World!");
});

let customers = [
    {
        id: 1,
        name: "Bukola",
        stamps: 5,
        freeCoffee: 0,
    },

    {
        id: 2,
        name: "Lindsay",
        stamps: 2,
        freeCoffee: 3,
    },

    {
        id: 3,
        name: "Neill",
        stamps: 0,
        freeCoffee: 1,
    },
];

//get all the customer data
app.get("/customers", (req, res) => {
    res.json(customers);
});

//generated the id using the length of the array

const generateId = () => {
    const arrayLength = customers.length + 1;
    return arrayLength;
};

//create a customer
app.post("/customer", (req, res) => {
    const body = req.body;
    if (!body.name) {
        res.status(400).json({ error: "content missing" });
        return;
    }

    const onecustomer = {
        id: generateId(),
        name: body.name,
        stamps: 0,
        freeCoffee: 0,
    };

    customers = customers.concat(onecustomer);
    res.json(onecustomer);
});

// update customer data to add a stamp and free coffee (if it meets the conditions)
app.patch("/customers/customer/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const body = req.body;
    const customer = customers.find((oneCustomer) => oneCustomer.id === id);

    let stamps = body.stamps;
    let freeCoffee = 0;

    if (stamps >= 6) {
        freeCoffee += Math.floor(stamps / 6);
        stamps = stamps % 6;
    }

    customer.stamps = stamps;
    customer.freeCoffee = freeCoffee;

    res.json(customer);
});

// list stamp and free coffee of a specific customer

app.get("/customers/customer/:id/stampsandfreecoffee", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = customers.find((oneCustomer) => oneCustomer.id === id);

    res.json({
        stamps: customer.stamps,
        freeCoffee: customer.freeCoffee,
    });
});

//Redeem free coffee
app.post("/customers/customer/:id/redeem", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = customers.find((oneCustomer) => oneCustomer.id === id);

    if (customer.freeCoffee > 0) {
        customer.freeCoffee--;
        res.json({
            message: `You have redeemed a free coffee. You have ${customer.freeCoffee} left to redeem`,
        });
    } else if (customer.freeCoffee === 0) {
        res.json({ message: `You have no coffee to redeem` });
    }
});

//use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});
