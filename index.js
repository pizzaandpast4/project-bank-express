import express from 'express';

const app = express();
app.use(express.json());

let accounts = [];
const port = 3333;

const isAdult = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }

    return age >= 18;
};

const formatCurrency = (cents) => {
    return (cents / 100).toFixed(2).replace('.', ',') + ' Eur';
};

app.post('/api/account', (req, res) => {
    const { firstName, lastName, dateOfBirth } = req.body;

    if (!firstName || !lastName || !dateOfBirth) {
        return res.json({ message: 'There was an error.', error: 'First name, last name, and date of birth are required.' });
    }

    if (!isAdult(dateOfBirth)) {
        return res.json({ message: 'There was an error.', error: 'User must be at least 18 years old.' });
    }

    const existingAccount = accounts.find(account =>
        account.firstName.toLowerCase() === firstName.toLowerCase() &&
        account.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (existingAccount) {
        return res.json({ message: 'There was an error.', error: 'Account already exists.' });
    }

    const newAccount = {
        id: accounts.length + 1,
        firstName,
        lastName,
        dateOfBirth,
        balance: 0
    };
    accounts.push(newAccount);
    res.json({ message: `Account created for ${firstName} ${lastName}` });
});

app.get('/api/account/:name-surname', (req, res) => {
    const [firstName, lastName] = req.params['name-surname'].toLowerCase().split('-');
    const account = accounts.find(acc =>
        acc.firstName.toLowerCase() === firstName &&
        acc.lastName.toLowerCase() === lastName
    );

    if (!account) {
        return res.json({ message: 'There was an error.', error: 'Account not found.' });
    }

    res.json({ firstName: account.firstName, lastName: account.lastName, dateOfBirth: account.dateOfBirth });
});

app.delete('/api/account/:name-surname', (req, res) => {
    const [firstName, lastName] = req.params['name-surname'].toLowerCase().split('-');
    const accountIndex = accounts.findIndex(acc =>
        acc.firstName.toLowerCase() === firstName &&
        acc.lastName.toLowerCase() === lastName
    );

    if (accountIndex === -1) {
        return res.json({ message: 'There was an error.', error: 'Account not found.' });
    }

    if (accounts[accountIndex].balance > 0) {
        return res.json({ message: 'There was an error.', error: 'Cannot delete account with balance.' });
    }

    accounts.splice(accountIndex, 1);
    res.json({ message: 'Account deleted successfully.' });
});

app.put('/api/account/:name-surname', (req, res) => {
    const [firstName, lastName] = req.params['name-surname'].toLowerCase().split('-');
    const account = accounts.find(acc =>
        acc.firstName.toLowerCase() === firstName &&
        acc.lastName.toLowerCase() === lastName
    );

    if (!account) {
        return res.json({ message: 'There was an error.', error: 'Account not found.' });
    }

    const updates = req.body;

    Object.keys(updates).forEach(key => {
        if (account.hasOwnProperty(key)) {
            account[key] = updates[key];
        }
    });

    return res.json({ message: 'Account updated successfully.', account });
});

app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
});
