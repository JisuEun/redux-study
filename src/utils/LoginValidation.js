function Validation(values) {
    let errors = {};

    if (!values.username.trim()) {
        errors.username = "Username cannot be empty";
    }

    if (!values.password) {
        errors.password = "Password cannot be empty";
    }

    return errors;
}

export default Validation;