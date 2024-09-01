import express from 'express';

const app = express();
app.use(express.json());

let accounts = {};
const port = 3333;

const isAdult = (dob) => {
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18;
};

app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
});
