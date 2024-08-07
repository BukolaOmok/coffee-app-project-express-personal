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

let customerData = [
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
app.get("/customerdata", (req, res) => {
    res.json(customerData);
});

//generated the id using the length of the array
const generateId = () => {
    const maxId =
        customerData.length > 0
            ? Math.max(...customerData.map((n) => Number(n.id)))
            : 0;
    return String(maxId + 1);
};

//create a customer
app.post("/customerdata", (req, res) => {
    const body = req.body;
    if (!body.name) {
        res.status(400).json({ error: "content missing" });
        return;
    }

    const oneCustomerData = {
        id: generateId(),
        name: body.name,
    };

    customerData = customerData.concat(oneCustomerData);
    res.json(oneCustomerData);
});

// update customer data to add a stamp and free coffee (if it meets the conditions)
app.patch("/customerdata/customer/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const customer = customerData.find((oneCustomer) => oneCustomer.id === id);
    customer.stamps = body.stamps;

    let stamps = body.stamps;
    let freeCoffee = customer.freeCoffee || 0;

    if (stamps >= 6) {
        freeCoffee += Math.floor(stamps / 6);
        stamps = stamps % 6;
    }

    customer.stamps = stamps;
    customer.freeCoffee = freeCoffee;

    res.json(customer);
});

// list stamp and free coffee of a specific customer (this does not work)

app.get("/customerdata/customer/:id/stampsandfreecoffee", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = customerData.find((oneCustomer) => oneCustomer.id === id);

    res.json({
        stamps: customer.stamps,
        freeCoffee: customer.freeCoffee || 0,
    });
});

//Redeem free coffee
app.post("/customerdata/customer/:id/redeem", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = customerData.find((oneCustomer) => oneCustomer.id === id);

    if (customer.freeCoffee > 0) {
        customer.freeCoffee--;
        res.json({
            message: `You have redeemed free coffee. You have ${customer.freeCoffee - 1} left to redeem`,
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
