import express from 'express';

const app = express();
app.use(express.json());

let accounts = [];
const port = 3333;

const isAdult = (dob) => {
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18;
};

const formatCurrency = (cents) => {
    return (cents / 100).toFixed(2).replace('.', ',') + ' Eur';
};

const validateAccountData = ({ firstName, lastName, dateOfBirth }) => {
    if (!firstName || !lastName || !dateOfBirth) {
        return { valid: false, error: 'First name, last name, and date of birth are required.' };
    }
    if (!isAdult(dateOfBirth)) {
        return { valid: false, error: 'User must be at least 18 years old.' };
    }
    return { valid: true };
};

app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
});
