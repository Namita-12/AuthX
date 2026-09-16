const {
    authenticateUser
} = require("./authenticationService");

console.log(
    "\n=== AUTHENTICATION FLOW TEST ==="
);

console.log(
    "\n1. CORRECT + EXPOSED CREDENTIAL"
);

const exposedLogin =
    authenticateUser(
        "user_001",
        "example-password"
    );

console.log(exposedLogin);


console.log(
    "\n2. WRONG CREDENTIAL"
);

const failedLogin =
    authenticateUser(
        "user_001",
        "wrong-password"
    );

console.log(failedLogin);


console.log(
    "\n3. UNKNOWN USER"
);

const unknownUser =
    authenticateUser(
        "unknown_user",
        "example-password"
    );

console.log(unknownUser);