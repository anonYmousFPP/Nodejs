const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

function validationInput(user){
    // Validate user input
    if (!user.name || !user.email || !user.password) {
        console.log("Invalid input");
        return 0;
    }
    return 1;
}

// Checking existing users
function isExisting(){
    const existingUsers = [{ email: "test@example.com" }];
    if (existingUsers.some(u => u.email === user.email)) {
        console.log("Email already exists");
        return 0;
    }
    return 1;
}

// Hashing the password
async function hashedPassword(){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    return hashedPassword;
}

// Saving the user to the database
function savingDB(user){
    const newUser = { name: user.name, email: user.email, password: hashedPassword };
    console.log("User saved:", newUser);
    return newUser;
}

// Sending the confirmation email
function confirmationMail(){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'your-email@gmail.com', pass: 'your-password' }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'Welcome!',
        text: 'Thank you for registering!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email failed", error);
            return info;
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

// Registering the user (by calling the above helper functions)
async function registerUser(user){
    try {
        validationInput(user);

        if (isExisting(user.email)) {
            throw new Error("Email already exists");
        }

        const hashedPass = await hashedPassword(user.password);
        user.password = hashedPass;

        const newUser = savingDB(user);

        confirmationMail(user.email)
            .catch(emailError => console.error("Email sending failed:", emailError));
        console.log("User registered successfully!");
        return newUser;
    } catch (error) {
        console.error("Registration failed:", error.message);
        throw error;
    }
}

const user = {
    name: "abhay",
    email: "abhay14122001@gmail.com",
    password: "abhay123"
};
await registerUser(user);