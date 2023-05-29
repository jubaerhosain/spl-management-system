const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const specialChars = "!@#$%^&*()_+{}[]?/";

// shuffled character set
const charset = shuffle(lowercase + uppercase + numbers + specialChars);

function shuffle(str) {
    let arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}

function generate(length) {
    let password = "";

    // get a lowercase character
    password += lowercase[Math.floor(Math.random() * lowercase.length)];

    // get an uppercase character
    password += uppercase[Math.floor(Math.random() * uppercase.length)];

    // get a number
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // get a special character
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // add other characters to the password
    for (let i = 0; i < length - 4; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    password = shuffle(password);

    return password;
}

async function generateSinglePassword(passwordLength = 10) {
    if (passwordLength < 10) {
        passwordLength = 10;
    }
    return generate(passwordLength);
}

async function generateMultiplePassword(noOfPasswords = 1, passwordLength = 10) {
    if (passwordLength < 10) {
        passwordLength = 10;
    }

    const passwords = [];
    for (let i = 0; i < noOfPasswords; i++) {
        passwords.push(generate(passwordLength));
    }

    return passwords;
}

export { generateSinglePassword, generateMultiplePassword };
