export const validatePassword = (password) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password.length < 8) throw new Error("Password must be at least 8 characters");

    let result = regex.test(password);
    if (!result)
        throw new Error(
            "Must contain at least one uppercase, lowercase, number and special character"
        );

    return true;
};
